'use strict'

const User = use('App/Models/User')

class UserController {

    async login({request, auth, response}){
      try { 

        const token = await auth.withRefreshToken().attempt(
          request.body.data.login,
          request.body.data.password
        )
        //await user.tokens()
        //    .delete()

        return response.json({
          success: true,
          data: token
        })
      } catch (error) {
        console.log(error);
        response.status(400).json({
          success: false,
          message: 'Invalid email/password'
        })
  }
    }

    async logout({request, auth, response}){

    }

    async signup({request, auth, response}){
        console.log(auth);
        const userData = request.body.data;
        try {
          const user = await User.create(userData)
          // generate JWT token for user
          const token = await auth.generate(user)
    
          return response.json({
            status: 'success',
            data: token
          })
        } catch (error) {
          console.log(error);
            return response.status(400).json({
                status: 'error',
                message: 'There was a problem creating the user, please try again later.'
            })
        }
    }

    async getUsers({request, auth, response}){
      try {
        const currentUser = await User.find(auth.current.user.id);
        return response.json({
          status: true,
          data : currentUser
        })
      } catch (error) {
        return response.status(400).json({
          success : false,
          message : 'User not found'
        })
      }

    }
}

module.exports = UserController
