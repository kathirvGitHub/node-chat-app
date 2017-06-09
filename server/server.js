const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    var message = {
        text : 'First message',
        to : 'User A',
        from : 'User B'
    };
    socket.emit('newMessage', message);

    socket.on('ackNewMessage', (message) => {
        console.log('Acknowledgement from user' , message);
    });

    socket.on('createMessage', (message) => {
        console.log('Message created by user:', message);

        socket.emit('ackCreateMessage', {
            text: 'Message received by Server'
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});