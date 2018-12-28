'use strict'

const Ws = use('ws');

class SocketController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
    console.log('socket contsructor');
    console.log('topic ' + socket.topic)
    //console.log(socket.id);

    /*
    socket.emit('contractRecieved', {
      data: '1',
      msg : 'ttt'
    })
    */
  }

  onContractCreate(UserId){
    console.log('contract create')   
    console.log(UserId)    

    const receive = Ws.getChannel('contractsRoom:*')
    for(var i=0; i<UserId.length; i++){
      receive.topic('contractsRoom:' + UserId[i]).emit('contractRecieved', "hello" )
      console.log(UserId)
    }
  }




}

module.exports = SocketController
