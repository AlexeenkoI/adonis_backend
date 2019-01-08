'use strict'
const User = use("App/Models/User")
/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/



const Ws = use('Ws')

//Ws.channel('contractsRoom', ({ socket }) => {
//  console.log('user joined with %s socket id', socket.id)
//})
Ws.channel('contractsRoom','SocketController')
.middleware(['auth:jwt']);





//const Server = use('Server')
//const io = use('socket.io')(Server.getInstance())
//io.on('connection', function (socket){
//  console.log(socket.id)
//
//  socket.emit('testEmit',{
//    data : 1,
//    msg : 'test'
//  })
//  socket.on('disconnect', function (socket) {
//    console.log('socket disconnected');
//    console.log(socket.id);
//  })
//})

