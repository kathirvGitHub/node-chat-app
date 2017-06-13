const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const messageUtils = require ('./utils/message');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('welcomeMessage', messageUtils.generateMessage('Server', 'Greetings! Welcome to the server' ) );
    // socket.broadcast.emit('newUserAlert' , messageUtils.generateMessage('Server', 'New User has joined' ) );

    socket.emit('broadCastMessage', messageUtils.generateMessage('Server', 'Greetings! Welcome to the server' ) );
    socket.broadcast.emit('broadCastMessage' , messageUtils.generateMessage('Server', 'New User has joined' ) );

    // var message = {
    //     text : 'First message',
    //     to : 'User A',
    //     from : 'User B'
    // };
    // socket.emit('newMessage', message);

    // socket.on('ackNewMessage', (message) => {
    //     console.log('Acknowledgement from user' , message);
    // });

    // socket.on('createMessage', (message) => {
    //     console.log('Message created by user:', message);

    //     socket.emit('ackCreateMessage', {
    //         text: 'Message received by Server'
    //     });
    // });

    socket.on('createBroadcastMessage', (message) => {
        console.log('Broadcast Message created by user:', message);

        // socket.emit('ackCreateBroadcastMessage', {
        //     text: 'Broadcast Message received by Server'
        // });

        // io.emit('broadCastMessage' , {message});

        socket.broadcast.emit('broadCastMessage' , messageUtils.generateMessage(message.from, message.text ));
    });

    // socket.on('ackBroadCastMessage', (message) => {
    //     console.log('Acknowledgement of broadcast from user' , message);
    // });

    // socket.on('createMessagewithAck', (message, callback) => {
    //     console.log('New MessagewithAck from user' , message);
    //     callback('From Server - Message looks valid.');
    // });

    socket.on('createLocationMessage', (coords) => {        

        // socket.broadcast.emit('broadCastMessage' , messageUtils.generateMessage('User', `${coords.latitude} , ${coords.longitude}` ));
        socket.broadcast.emit('newLocationMessage' , messageUtils.generateLocationMessage('User', coords.latitude , coords.longitude ));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});