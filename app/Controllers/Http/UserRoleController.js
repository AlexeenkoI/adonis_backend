'use strict'

const userRoles = use('App/Models/UserRole');
const { validate } = use('Validator');

class UserRoleController {
  
  async getAll({request, response}){
    //TO DO
    try {
      const result = await userRoles.query().fetch();

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
      const result = await userRoles.query()
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
      const user_role = await userRoles.find(params.id);
      for (let key in data){
        if(key === 'id') continue;
        user_role[key] = data[key];
      }
      await user_role.save();
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
      const user_role = await userRoles.query()
        .where('id',params.id)
        .firstOrFail();
      
      await user_role.delete();

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
      const user_role = new userRoles();
      for (let key in data){
        user_role[key] = data[key];
      }
      const result = await user_role.save();
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

module.exports = UserRoleController
