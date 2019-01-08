'use strict'
/** @type {typeof import('../../Models/Contracts')} */

const Contracts = use('App/Models/Contracts');
const User = use("App/Models/User");
const Performes = use('App/Models/Performes');
const Ws = use('Ws');
const SocketService = use('App/Services/SocketService');

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
      //console.log('pre params');
      //console.log(incParams);
      let params = {
          //...defaultParams,
          page :  incParams.page ? incParams.page : 1, 
          limit : incParams.limit ? incParams.limit : 10,
          //...incParams,
          data:{
            ...defaultParams.data,
            ...incParams.data
          }
      }
      //console.log('inc params');
      //console.log(params);
      try {
        let subQ;
        //Подзапрос для вывода заявок по исполнителям
        if(params.data.contractor && params.data.contractor !== null){
          subQ = await Performes.query().select('contract_id').whereIn('user_id',params.data.contractor).fetch();
        }
        const contracts = await Contracts
        .query()
        .where(builder => {
          for (let key in params.data){
            //отсекаем дефолтные и пустые  значения
            if(params.data[key] === null) continue;
            if(params.data[key] === '') continue;
            if(key === 'date_started'){
              builder.where('date_deadline', '>=', params.data[key]);
            }
            else if(key === 'date_deadline'){
              builder.where('date_deadline', '<=',params.data[key]);
            }
            else if(key === 'whereString'){
              let str = params.data[key];
              builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${str}%'`);
            }
            else if(key === 'contractor'){
              if(params.data[key][0] != null)
              builder.whereIn('id', subQ.rows.map( item => item.contract_id));
            }else {
              builder.where(key, params.data[key])
            }
          }
        })
        .with('users')
        .paginate(params.page, params.limit)
        
       // const t = await contracts.users().fetch();
        //console.log(t)

        //if(params.data.contractor[0] !== null){
        //  contracts.users = await contracts.users().fetch();
        //}else{
        //  contracts.users = {};
        //}
        //console.log('sockets');
        //console.log(io.sockets.clients());
        contracts.date_deadline = new Date(contracts.date_deadline * 1000);

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
          //.with('users')
          .firstOrFail();

        const contractUsers = await contract.users().fetch();
        const userResult = contractUsers.rows.map( item => item.id);
        contract.contractor = userResult;
        //console.log(contract);
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

          let connSocks = [];

          data.contractor.forEach( id => {
            const connectedId = SocketService.Get(id);
            if(connectedId !== -1){
              connSocks.push(connectedId);
            }
          })
          console.log('connected sockets');
          console.log(connSocks);
          if(connSocks.length > 0){
            const data = [{
              
              message : `Изменения по заявке ${contract.id}`,
              id : contract.id
            }]
            await Ws
            .getChannel('contractsRoom')
            .topic('contractsRoom')
            .emitTo('newContractData',data,connSocks)
          }
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

        await contract.users().detach();

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
        let connSocks = [];

        data.contractor.forEach( id => {
          const connectedId = SocketService.Get(id);
          if(connectedId !== -1){
            connSocks.push(connectedId);
          }
        })
        console.log('connected sockets');
        console.log(connSocks);
        if(connSocks.length > 0){
          const data = [{
              
            message : `Новое заявление № ${contract.id}`,
            id : contract.id
          }]
          await Ws
          .getChannel('contractsRoom')
          .topic('contractsRoom')
          .emitTo('newContractData',data,connSocks)
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
