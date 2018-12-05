'use strict'

const Contracts = use('App/Models/Contracts');

class ContractController {
    async getUsers({ request, response }){
      //const contracts = await Contracts.find(3);
      const { data } = request.post();
      //const test = await contracts.users().wherePivot('contract_id',contracts.id).fetch();
      console.log(data);
      const contracts = await Contracts
        .query()
        //.where('customer_id', 3)
        .where(builder => {
          for(var key in data){
            if(key === 'whereString'){
              builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${data[key]}%'`);
            }else{
              builder.where(key, data[key]);
            }
          }
        })
        .with('users')
        //.paginate()
        .fetch();
      let resp = {
        data : contracts,
        //t: test
      }
      //return resp;
      response.status(200).json({
        sucess: true,
        data : contracts
      })
    }
}

module.exports = ContractController
