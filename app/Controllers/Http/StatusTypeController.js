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

  async updateOne({request, params, response}){
    //TO DO
    const data = request.body.data;
    try {
      const status_type = await StatusTypes.find(params.id);
      for (let key in data){
        if(key === 'id') continue;
        status_type[key] = data[key];
      }
      const result = await status_type.save();
      return response.status(200).json({
        success : true,
        message : 'Опция успешно изменена',
      })
    } catch (error) {
      return response.status(500).json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }
  }

  async deleteOne({params, response}){
    //TO DO
    try {
      const status_type = await StatusTypes.query()
        .where('id',params.id)
        .firstOrFail();
      
      await status_type.delete();

      return response.status(200).json({
        success : true,
        message : `Опция успешно удалена`
      })

    } catch (error) {
      return response.status(500).json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }
  }

  async createOne({request, response}){
    //TO DO
    const data = request.body.data;
    try {
      const status_type = new StatusTypes();
      for (let key in data){
        status_type[key] = data[key];
      }
      const result = await status_type.save();
      return response.status(200).json({
        success : true,
        message : 'Опция добавлена',
      })
    } catch (error) {
      return response.status(500).json({
        success : false,
        message : `Ошибка : ${error.message}`
      })
    }
  }
}

module.exports = StatusTypeController
