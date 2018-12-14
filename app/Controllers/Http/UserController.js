'use strict'

const User = use('App/Models/User');
const userRole = use('App/Models/UserRole');
const { validate } = use('Validator');

class UserController {

    async login({request, auth, response}){
      try { 

        const token = await auth.withRefreshToken().attempt(
          request.body.data.login,
          request.body.data.password
        )
        //await user.tokens()
        //    .delete()

        response.cookie('auth_token', token.token);
        response.cookie('auth_refresh', token.refreshToken);
        //TO DO get user DAta to response

        //
        return response.json({
          success: true,
          //data: token
          message : 'Авторизация успешна'
        })
      } catch (error) {
        console.log(error);
        response.status(400).json({
          success: false,
          message: 'Неверные логин\\пароль'
        })
  }
    }

    async logout({request, auth, response}){

    }

    async signup({request, auth, response}){
      const data = request.body.data;
      try {
        const user = new User();
        for (let key in data){
          user[key] = data[key];
        }
        const result = await user.save();
        return response.status(200).json({
          success : true,
          message : `Пользователь ${user.name} успешно создан`,
          insertId : user.id
        })
      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }
        //console.log(auth);
        //const userData = request.body.data;
        //try {
        //  const user = await User.create(userData)
        //  // generate JWT token for user
        //  const token = await auth.generate(user)
    //
        //  return response.json({
        //    status: 'success',
        //    data: token
        //  })
        //} catch (error) {
        //  console.log(error);
        //    return response.status(400).json({
        //        status: 'error',
        //        message: 'There was a problem creating the user, please try again later.'
        //    })
        //}
    }

    async getUsers({request, auth, response}){
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
        const users = await User.query()
          .where( builder => {
            if(params.whereString && params.whereString !== ''){
              const str = params.whereString;
              builder.whereRaw(`CONCAT(name,' ',surename) LIKE '%${str}%'`)
            }
          })
          .with('role')
          .paginate(params.page, params.limit);
        return response.status(200).json({
          success : true,
          data : users
        })
      } catch (error) {
        return response.status(400).json({
            success:false,
            message: `Ошибка: ${error.message}`
        })
      }
    }

    async deleteUser({request, params, auth, response}){
      const rules = {
        id : "number|required"
      }
  
      const validation = await validate(params, rules);

      if(auth.current.user.id === params.id){
        return response.status(200).json({
          success : false,
          message : "Вы не можете удалить пользователя, под которым осуществляется работа"
        })
      }
  
      if(validation.fails()){
        return response.status(400).json({
          success : false,
          message : "incorrect data"
        })
      }

      try {
        const user = await User.query()
        .where('id',params.id)
        .firstOrFail();
  
        await user.delete();
  
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

    async getUser({params, response}){
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
        const user = await User.query()
          .where('id', params.id)
          .firstOrFail();
        user.role_data = await user.role().fetch();
        return response.status(200).json({
          success : true,
          data : user
        })
        
      } catch (error) {
        return response.status(404).json({
          success : false,
          message : `User with id ${error.message} not found`
        })
      }

    }

    async updateUser({request, params, response}){
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
        const user = await User.find(params.id);
        for (let key in data){
          if(key === 'id') continue;
          user[key] = data[key];
        }
        const result = await user.save();
        return response.status(200).json({
          success : true,
          message : `Пользователь ${user.name} успешно создан`,
          updateId : user.id
        })
      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }
    }

}

module.exports = UserController
