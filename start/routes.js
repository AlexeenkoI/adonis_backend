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
Route.post('/api/logout', 'UserController.logout').middleware(['auth:jwt']);

Route.group(() => {
  Route.put('/create', 'UserController.signup');
  Route.post('/getall','UserController.getUsers');
  Route.delete('/delete/:id', 'UserController.deleteUser');
  Route.get('/get/:id', 'UserController.getUser');
  Route.put('/update/:id','UserController.updateUser');
})
.prefix('api/users')
.middleware(['auth:jwt']);

// Роуты списка заявлений/контрактов (Contracts)
Route.group(()=>{
  Route.post('/getall',  'ContractController.getContracts');
  Route.put('/create', 'ContractController.createContract')
  Route.get('/get/:id', 'ContractController.getContract');
  Route.put('/update/:id', 'ContractController.updateContract');
  Route.delete('delete/:id', 'ContractController.deleteContract');

})
.prefix('api/contracts')
.middleware(['auth:jwt']);

//Роуты клиентов (Customers)
Route.group(() => {
  Route.post('/getall', 'CustomerController.getCustomers');
  Route.get('/get/:id', 'CustomerController.getCustomer');
  Route.put('/update/:id', 'CustomerController.updateCustomer');
  Route.delete('/delete/:id', 'CustomerController.deleteCustomer');
  Route.put('/create', 'CustomerController.createCustomer');
})
.prefix('api/customers')
.middleware(['auth:jwt']);

//Блок роутов настроек
Route.group(() => {
  Route.post('/getall','StatusTypeController.getAll');
  Route.get('/get/:id','StatusTypeController.getOne');
  Route.put('/update/:id','StatusTypeController.updateOne');
  Route.delete('/delete/:id','StatusTypeController.deleteOne');
  Route.put('/create','StatusTypeController.createOne');
})
.prefix('api/status_types')
.middleware(['auth:jwt']);

Route.group(() => {
  Route.post('/getall','WorkTypeController.getAll');
  Route.get('/get/:id','WorkTypeController.getOne');
  Route.put('/update/:id','WorkTypeController.updateOne');
  Route.delete('/delete/:id','WorkTypeController.deleteOne');
  Route.put('/create','WorkTypeController.createOne');
})
.prefix('api/work_types')
.middleware(['auth:jwt']);

Route.group(() => {
  Route.post('/getall','UserRoleController.getAll');
  Route.get('/get/:id','UserRoleController.getOne');
  Route.put('/update/:id','UserRoleController.updateOne');
  Route.delete('/delete/:id','UserRoleController.deleteOne');
  Route.put('/create','UserRoleController.createOne');
})
.prefix('api/roles')
.middleware(['auth:jwt']);

Route.group(() => {
  Route.get('/getall', 'SettingController.getAll');
})
.prefix('api/settings')
.middleware(['auth:jwt']);

Route.group(()=> {
  Route.post('/upload', 'FilesController.upload');
})
.prefix('api/files');
//.middleware(['auth:jwt']);

//test files
Route.post('/files', 'FilesController.upload');
