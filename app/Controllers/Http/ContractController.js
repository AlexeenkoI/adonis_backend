'use strict'

const Contracts = use('App/Models/Contracts');
const Performes = use('App/Models/Performes');
const Hash = use('Hash');

class ContractController {
    async getContracts({ request, auth, response }){
      //const contracts = await Contracts.find(3);
      const { data } = request.post();
      //const test = await contracts.users().wherePivot('contract_id',contracts.id).fetch();
      //console.log(data);
      const pwd = await Hash.make(data.passw);
      console.log('password:');
      console.log(pwd);
      const ids = await Performes.query().distinct('contract_id').whereIn('user_id',[1,2]).fetch()
      console.log(ids.rows)

      const t =ids.rows.map(item=> item.contract_id);
      //return response.status(200).json({
      //  d : t
      //})
      console.log(t);
      const contracts = await Contracts
        .query()
        //.where('customer_id', 3)
        .where(builder => {
          for(let key in data){
            if(key === 'whereString'){
              builder.whereRaw(`CONCAT(contract_number, address) LIKE '%${data[key]}%'`);
            }else{
              //builder.where(key, data[key]);
            }
          }
        })
        .whereIn('id',ids.rows.map(item=> item.contract_id))
        .with('users')
        .paginate()
        //.toString()
        //.fetch()
        //.toSQL();

      //return resp;
      response.status(200).json({
        sucess: true,
        data : contracts
      })
    }
}

module.exports = ContractController
