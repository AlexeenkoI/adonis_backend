'use strict'

const Ws = use('ws');

class SocketController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
    console.log('socket contsructor');
    console.log(socket.id);

    socket.emit('contractRecieved', {
      data: '1',
      msg : 'ttt'
    })
  }


}

module.exports = SocketController
