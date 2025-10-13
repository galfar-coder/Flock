import { Server } from 'socket.io';

const io = new Server({cors: {origin: '*'}});

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('message', msg);
    });
});

io.listen(6942);