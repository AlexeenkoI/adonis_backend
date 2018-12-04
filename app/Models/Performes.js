'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Performes extends Model {
    static get table(){
        return 'performes';
      }
}

module.exports = Performes
