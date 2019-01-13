'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {

  static get table () {
    return 'customers'
  }
  static get hidden () {
    return ['ctime']
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  } 
}

module.exports = Customer
