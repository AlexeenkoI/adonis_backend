'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  //hide returning password field
  static get hidden () {
    return ['password']
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
      return null;
  }

  static get table(){
    return 'users';
  }

  contracts(){
    return this.belongsToMany('App/Models/Contracts');
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  //зависимость через performes для контрактов
  contracts() {
    return this
      .belongsToMany(
          'App/Models/Contracts',
          'user_id',
          'contract_id')    
      .pivotTable('performes')
  }
  //Роль в системе
  role(){
    return this
      .belongsTo(
        'App/Models/UserRole',
        'role_id',
        'id',
      )
  }
}

module.exports = User
