const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const messageUtils = require ('./utils/message');
const bodyParser = require('body-parser');
const {isRealString} = require ('./utils/validation')
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('welcomeMessage', messageUtils.generateMessage('Server', 'Greetings! Welcome to the server' ) );
    // socket.broadcast.emit('newUserAlert' , messageUtils.generateMessage('Server', 'New User has joined' ) );

    // socket.emit('broadCastMessage', messageUtils.generateMessage('Server', 'Greetings! Welcome to the server' ) );
    // socket.broadcast.emit('broadCastMessage' , messageUtils.generateMessage('Server', 'New User has joined' ) );

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

    socket.on('join', (params, callback) => {
        // console.log(params);
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room invalid!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUsersList(params.room));

        socket.emit('broadCastMessage', messageUtils.generateMessage('Server', 'Greetings! Welcome to the server' ) );
        socket.broadcast.to(params.room).emit('broadCastMessage' , messageUtils.generateMessage('Server', `${params.name} has joined` ) );

        callback();
    });

    socket.on('createBroadcastMessage', (message, callback) => {
        console.log('Broadcast Message created by user:', message);

        // socket.emit('ackCreateBroadcastMessage', {
        //     text: 'Broadcast Message received by Server'
        // });

        // io.emit('broadCastMessage' , {message});

        // socket.broadcast.emit('broadCastMessage' , messageUtils.generateMessage(message.from, message.text ));

        // io.emit('broadCastMessage' , messageUtils.generateMessage(message.from, message.text ));
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('broadCastMessage', messageUtils.generateMessage(user.name, message.text ));
        }

        callback();
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
        // socket.broadcast.emit('newLocationMessage' , messageUtils.generateLocationMessage('User', coords.latitude , coords.longitude ));

        // io.emit('newLocationMessage' , messageUtils.generateLocationMessage('User', coords.latitude , coords.longitude ));
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', messageUtils.generateLocationMessage(user.name, coords.latitude , coords.longitude ));
        }
        
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
            io.to(user.room).emit('broadCastMessage', messageUtils.generateMessage('Server', `${user.name} has left the room` ));
        }
        console.log('User disconnected');
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

app.post('/chat.html', (req, res) => {
    console.log(req.body);
    // var sessionid = '12368';
    // res.sendFile(publicPath + '/chat.html');
    res.redirect(`/chat.html?name=${req.body.name}&room=${req.body.room}`);
});