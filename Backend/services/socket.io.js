
import { Server } from 'socket.io';

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:8081',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        // Escucha otros eventos aquí
        socket.on('message', (data) => {
            console.log('Message received:', data);
            io.emit('message', data); 
        });
    });

    return io;
};

export default initSocket;
