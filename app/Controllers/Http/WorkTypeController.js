'use strict'
const  workTypes = use('App/Models/WorkType');
const { validate } = use('Validator');

class WorkTypeController {

  async getAll({request, response}){
    //TO DO
    try {
      const result = await workTypes.query().fetch();

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
      const result = await workTypes.query()
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
      const work_type = await workTypes.find(params.id);
      for (let key in data){
        if(key === 'id') continue;
        work_type[key] = data[key];
      }
      await work_type.save();
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
      const work_type = await workTypes.query()
        .where('id',params.id)
        .firstOrFail();
      
      await work_type.delete();

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
      const work_type = new workTypes();
      for (let key in data){
        work_type[key] = data[key];
      }
      const result = await work_type.save();
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

module.exports = WorkTypeController
