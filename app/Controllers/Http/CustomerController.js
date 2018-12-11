'use strict'

const Customers = use('App/Models/Customer')

class CustomerController {
  async getCustomers({request, response}){
    const defaults = {
      page : 1,
      limit : 10,
      whereString : false
    }
    let params = {
      ...defaults,
      ...request.body
    }
    try {
      const customers = await Customers.query()
        .where( builder => {
          if(params.whereString && params.whereString !== ''){
            const str = params.whereString;
            builder.whereRaw(`CONCAT(name,' ',firstname,' ', secondname) LIKE '%${str}%'`)
          }
        })
        .paginate(params.page, params.limit)

      response.status(200).json({
        success : true,
        data : customers
      })
    } catch (error) {
      response.status(400).json({
          success:false,
          message: `Ошибка: ${error.message}`
      })
    }
  }
  /**
   * Получить подробное инфо о клиенте
   *
   * @param  {Object} params - url params
   * @param  {Object} response
   *
   * @return {JSON}
   */
  async getCustomer({params, response}){
      try {
        const customer = await Customers.query()
          .where('id', params.id)
          .firstOrFail();

        return response.status(200).json({
          success : true,
          data : customer
        })
        
      } catch (error) {
        return response.status(404).json({
          success : false,
          message : `Customer with id ${params.id} not found`
        })
      }
  }

  async updateCustomer(){
      //TO DO
  }

  async deleteCustomer(){
      //TO DO
  }

  async createCustomer(){
      //TO DO
  }
}

module.exports = CustomerController
