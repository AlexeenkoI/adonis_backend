'use strict'

const Customers = use('App/Models/Customer');
const { validate } = use('Validator');

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
    const rules = {
      id : "number|required"
    }

    const validation = await validate(params, rules);

    if(validation.fails()){
      return response.status(400).json({
        success : false,
        message : "incorrect data"
      })
    }

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

  async updateCustomer({request, params, response}){
    const rules = {
      id : "number|required"
    }

    const validation = await validate(params, rules);

    if(validation.fails()){
      return response.status(400).json({
        success : false,
        message : "incorrect data"
      })
    }

    const data = request.body.data;
    try {
      const customer = await Customers.find(params.id);
      for (let key in data){
        if(key === 'id') continue;
        customer[key] = data[key];
      }
      const result = await customer.save();
      return response.status(200).json({
        success : true,
        message : `Клиент ${customer.name} успешно изменен`,
        updateId : customer.id
      })
    } catch (error) {
      return response.status(500).json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }
  }

  async deleteCustomer({params, response}){
    const rules = {
      id : "number|required"
    }

    const validation = await validate(params, rules);

    if(validation.fails()){
      return response.status(400).json({
        success : false,
        message : "incorrect data"
      })
    }
    try {
      const customer = await Customers.query()
      .where('id',params.id)
      .firstOrFail();

      await customer.delete();

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

  async createCustomer({request, response}){
    const data = request.body.data;
    try {
      const customer = new Customers();
      for (let key in data){
        customer[key] = data[key];
      }
      const result = await customer.save();
      return response.status(200).json({
        success : true,
        message : 'Клиент успешно создан',
        insertId : customer.id
      })
    } catch (error) {
      return response.status(500).json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }
  }
}

module.exports = CustomerController
