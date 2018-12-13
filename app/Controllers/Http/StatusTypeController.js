'use strict'
const  StatusTypes  = use('App/Models/StatusType');
const { validate } = use('Validator');

class StatusTypeController {

  async getAll({request, response}){
    //TO DO
    try {
      const result = await StatusTypes.query().fetch();

      return response.status(200).json({
        success : true,
        data : result
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message : `Ошибка ${error.message}`
      })
    }

  }

  async getOne({params, response}){
    //TO DO
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
      const result = await StatusTypes.query()
      .where('id', params.id)
      .firstOrFail();

      return response.status(200).json({
        success : true,
        data : result
      })
    } catch (error) {
      return response.status(404).json({
        success : false,
        message : `Setting with id ${params.id} not found`
      })
    }

  }

  async updateOne(){
    //TO DO
  }

  async deleteOne(){
    //TO DO
  }

  async createOne(){
    //TO DO
  }
}

module.exports = StatusTypeController
