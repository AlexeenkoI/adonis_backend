'use strict'
/** @type {typeof import('../../Models/Contracts')} */

const Contracts = use('App/Models/Contracts');
const User = use("App/Models/User");
const Performes = use('App/Models/Performes');
const Hash = use('Hash');

class ContractController {

    /**
     * Список контрактов с фильтрацией и пагинацией
     * @param {request} request
     * @param {response} response
     * @return {JSON} json with data
     */
    async getContracts({ request, response }){
      let defaultParams = {
        page : 1,
        limit : 20,
        data : {
          date_started : null,
          date_deadline : null,
          сustomer_id: null,
          address : null,
          type_of_work : null,
          contractor : null,
          status : null,
          whereString : null
        }
      }
      let incParams = request.body
      let params = {
          ...defaultParams,
          ...incParams,
          data:{
            ...defaultParams.data,
            ...incParams.data
          }
      }
      try {
        let subQ;
        //Подзапрос для вывода заявок по исполнителям
        if(params.data.contractor && params.data.contractor !== null){
          subQ = await Performes.query().distinct('contract_id').whereIn('user_id',params.data.contractor).fetch();
        }
        const contracts = await Contracts
        .query()
        .where(builder => {
          for (let key in params.data){
            //отсекаем дефолтные и пустые  значения
            if(params.data[key] === null) continue;
            if(params.data[key] === '') continue;

            if(key === 'date_started'){
              builder.where('date_started', '>', params.data[key]);
            }
            else if(key === 'date_deadline'){
              builder.where('date_deadline', '<',params.data[key]);
            }
            else if(key === 'whereString'){
              let str = params.data[key];
              builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${str}%'`);
            }
            else if(key === 'contractor'){
              builder.whereIn('id', subQ.rows.map( item => item.contract_id));
            }else {
              builder.where(key, params.data[key])
            }
          }
        })
        .with('users')
        .paginate(params.page, params.limit)

        return response.status(200).json({
          success: true,
          data : contracts
        })

      } catch (error) {
        return response.status(400).json({
          success : false,
          message : `Ошибка на сервере ${error.message}`
        })
      }
    }

    /**
     * 
     * @param {Object} params url params
     * @param {Object} response response object
     * @returns {JSON} json json-response
     */
    async getContract({params, response}){
      try {
        const  contract = await Contracts.query()
          .where('id',params.id)
          .with('users')
          .firstOrFail();
        
        return response.status(200).json({
          success : true,
          data : contract,
        })
      } catch (error) {
        return response.status(404).json({
          success : false,
          message : `Error : ${error.message}`
        })
      }

    }

    /**
     * 
     * @param {REQUEST} request
     * @param {RESPONSE} response
     * @returns {JSON} json 
     */
    async updateContract({request, params, response}){
      if(typeof params.id === 'undefined')
        return response.status(500).json({
          success : false,
          message : 'Ошибочные данные'
        })
      const data = request.body.data;
      try {
        const contract = await Contracts.find(params.id);
        for (let key in data){
          if(key === 'id') continue;
          if(key !=='contractor')
            contract[key] = data[key];
        }
        const result = await contract.save();
        if(data.contractor){
          //Синхронизируем связи в сводной таблице 
          // sunc = .detach([]) & .attach([]) - удаление связей и создание связей заново - апдейтим связующую таблицу
          await contract.users().sync(data.contractor);
        }
        return response.status(200).json({
          success : true,
          message : 'Контракт успешно изменен',
          updateId : contract.id
        })
      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }

    }


    /**
     * 
     * @param {REQUEST} request
     * @param {RESPONSE} response
     * @returns {JSON} json 
     */
    async deleteContract({request, params, response}){
      if(typeof params.id === 'undefined')
        return response.status(500).json({
          success : false,
          message : 'Ошибочные данные'
        })
      try {
        const contract = await Contracts.query()
          .where('id',params.id)
          .firstOrFail();
        
        await contract.delete();

        return response.status(200).json({
          success : true,
          message : `Успешно удалено`
        })

      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }
    }

    async createContract({request, response}){
      const data = request.body.data;

      try {
        const contract = new Contracts();
        for (let key in data){
          if(key !=='contractor')
            contract[key] = data[key];
        }
        const result = await contract.save();
        if(data.contractor){
          //Синхронизируем связи в сводной таблице 
          // здесь вызываем только attach([]) - добавление связей в сводную таблицу
          await contract.users().attach(data.contractor);
        }
        return response.status(200).json({
          success : true,
          message : 'Контракт успешно создан',
          insertId : contract.id
        })
      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }

    }
}

module.exports = ContractController
