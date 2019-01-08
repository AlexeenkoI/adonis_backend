'use strict'

const Ws = use('ws');
const SocketService = use('App/Services/SocketService');
//const SocketService = require('App/Services/SocketService');

class SocketController {
  constructor ({ socket, auth, request }) {
    this.socket = socket
    this.auth_id = auth.user.id;
    this.request = request
    console.log('socket contsructor');
    console.log(socket.id);
    //console.log(auth.user.id)

    //const channel = Ws.channel('contractsRoom');
    //var socket = channel.presence.get(auth.user.id)
    //var socket_id = socket[0].socket.id
    //const socket_id = socket.get(auth.user.id);

    //console.log('founded socket id:');
    SocketService.Add(auth.user.id, socket.id);
    //console.log(presense);
    //console.log(socket_id);

    //socket.emit('contractRecieved', {
    //  data: '1',
    //  msg : 'ttt'
    //})
  }

  async onOpen({ socket, auth, request }) {
    console.log('new connections established');
    SocketService.Add(auth.user.id, socket.id);
  }

  async onClose({ socket, auth, request }) {
    console.log('disconnected socket', this.socket.id);
    console.log('auth :' + this.auth_id);
		await SocketService.Delete(this.auth_id);
	}

	onError(error) {
		console.log('socket error', error);
	}


}

module.exports = SocketController
