let socketList = {};
class SocketService {
    constructor(){
        console.log('constructing  socket service...');
        
    }
	Add(userId, socketId) {
		socketList[userId] = socketId;
        console.log('SocketService Add:', userId);
        console.log('Socket list:');
        console.log(socketList);
	}

	Delete(userId) {
		console.log('SocketService Delete:', userId);
		if (!socketList[userId]) return;
		delete socketList[userId];
		console.log('SocketService Deleted');
	}

	Get(userId) {
		console.log('SocketService Get:', { userId, socketList });
		if (!socketList[userId]) return -1;

		console.log('SocketService Found:', userId);
		return socketList[userId];
	}

	ToArray() {
        console.log(socketList);
		return Object.values(socketList);
	}
}

module.exports = new SocketService();