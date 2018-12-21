'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contracts extends Model {
    static get createdAtColumn() {
        return 'date_started';
    }

    static get updatedAtColumn() {
        return null;
    }

    users() {
        return this
        .belongsToMany(
            'App/Models/User',
            'contract_id',
            'user_id')    
        .pivotTable('performes')
    }

    customers(){
        return this
        .belongsTo(
            'App/Models/Customer',
            'customer_id',
            'id',
          )
    }

    files(){
        return this
        .hasMany(
            'App/Models/Files',
            'contract_id',
            'id',
        )
    }

}

module.exports = Contracts
