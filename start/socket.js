'use strict'

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

/*

const Ws = use('Ws')

Ws.channel('test', ({ socket }) => {
  console.log('user joined with %s socket id', socket.id)
})

Ws.channel('open', ({socket}) => {
  console.log('open')
})
*/

const Server = use('Server')
const io = use('socket.io')(Server.getInstance())

io.on('connection', (socket) => {  
  console.log(socket.id)

  io.on('ContractPush', (room) => {
    socket.join(room)
    console.log(room)
  })

  
})
