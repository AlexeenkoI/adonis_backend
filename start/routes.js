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


Route.on('/').render('welcome');

//Тестовый  маршрут для создания пользователя
Route.post('/api/users/test','UserController.signup');

//Роуты пользователей и логин
Route.post('/api/login', 'UserController.login');

Route.group(() => {
  Route.put('/create', 'UserController.signup');
  Route.post('/getusers','UserController.getUsers');
  Route.delete('deleteuser/:id', 'UserController.deleteUser');
  Route.get('/getuser/:id', 'UserController.getUser');
  Route.put('/updateuser/:id','UserController.updateUser');
})
.prefix('api/users')
.middleware(['auth:jwt']);

// Роуты списка заявлений/контрактов (Contracts)
Route.group(()=>{
  Route.post('getcontracts',  'ContractController.getContracts');
  Route.put('createcontract', 'ContractsController.createContract')
  Route.get('getcontract/:id', 'ContractController.getContract');
  Route.put('updatecontract/:id', 'ContractController.updateContract');
  Route.delete('deletecontract/:id', 'ContractController.deleteContract');

})
.prefix('api/contracts')
.middleware(['auth:jwt']);

//Роуты клиентов (Customers)
Route.group(() => {
  Route.post('getcustomers', 'CustomerController.getCustomers');
  Route.get('getcustomer/:id', 'CustomerController.getCustomer');
  Route.put('updatecustomer/:id', 'CustomerController.updateCustomer');
  Route.delete('deletecustomer/:id', 'CustomerController.deleteCustomer');
  Route.put('/createcustomer', 'CustomerController.createCustomer');
})
.prefix('api/customers')
.middleware(['auth:jwt']);



