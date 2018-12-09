'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Database = use('Database');
const Contracts = use('App/Models/Contracts');
const Users = use('App/Models/User');


Route.on('/').render('welcome')

Route.post('/api/login', 'UserController.login')
Route.post('/api/users/test','UserController.signup')

Route.group(() => {
  Route.post('/create', 'UserController.signup')
  Route.post('/getusers','UserController.getUsers')
  // user login
})
.prefix('api/users')
.middleware(['auth:jwt'])
//.middleware('auth')

Route.group(()=>{
  Route.post('getcontracts', 'ContractController.getContracts');

}).prefix('api/contracts')
//.middleware('auth')

Route.get('/testquery', async ()=>{

  //const contractsData = await Contracts.query().where('id',3).fetch();
  //const users = await contractsData.users().fetch();
    //const contracts = await Contracts.find(3);
    const contracts = await Contracts.query().where('contracts_id', 3).with('users').fetch();
    //const test = await contracts.users().wherePivot('contract_id',contracts.id).fetch();
    //console.log(test);
    let resp = {
      data : contracts,
     // t: test
    }
    return resp;
})
