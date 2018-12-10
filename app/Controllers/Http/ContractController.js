'use strict'

const Contracts = use('App/Models/Contracts');
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
              let str = params.data;
              builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${str[key]}%'`);
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

        response.status(200).json({
          sucess: true,
          data : contracts
        })

      } catch (error) {
        response.status(400).json({
          sucess : false,
          message : `Ошибка на сервере ${error.message}`
        })
      }
      //const contracts = await Contracts
      //  .query()
      //  //.where('customer_id', 3)
      //  .where(builder => {
      //    for(let key in data){
      //      if(key === 'whereString'){
      //        builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${data[key]}%'`);
      //      }else{
      //        //builder.where(key, data[key]);
      //      }
      //    }
      //  })
      //  .whereIn('id',ids.rows.map(item=> item.contract_id))
      //  .with('users')
      //  .paginate()
        //.toString()
        //.fetch()
        //.toSQL();
    }

    /**
     * 
     * @param {REQUEST} request
     * @param {RESPONSE} response
     * @returns {JSON} json
     */
    getContract({request, response}){
      //TO DO getcoontract by id here
    }

    /**
     * 
     * @param {REQUEST} request
     * @param {RESPONSE} response
     * @returns {JSON} json 
     */
    updateContract({request, response}){
      // TO DO updatecontract here
    }


    /**
     * 
     * @param {REQUEST} request
     * @param {RESPONSE} response
     * @returns {JSON} json 
     */
    deleteContract({request, response}){
      //TO DO delete contract by id
    }
}

module.exports = ContractController
