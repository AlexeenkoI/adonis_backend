'use strict'

const statusTypes  = use('App/Models/StatusType');
const userRoles = use('App/Models/UserRole');
const workTypes = use('App/Models/WorkType');

class SettingController {

    async getAll({response}){
        
      try {
        let data = {};
        data.status_types = await statusTypes.query().fetch();
        data.work_types = await workTypes.query().fetch();
        data.user_roles = await userRoles.query().fetch();

        return response.status(200).json({
          success : true,
          data
        })
      } catch (error) {
        return response.status(500).json({
          success : false,
          message : `Ошибка : ${error.message}`
        })
      }

    }
}

module.exports = SettingController
