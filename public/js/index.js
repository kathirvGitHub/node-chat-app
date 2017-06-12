var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');  

    socket.emit('createMessage', {
        text : 'Second message',
        to : 'User B',
        from : 'User A'
    });  
});

socket.on('disconnect', function () {
    console.log('Server disconnected');
});

socket.on('newMessage', function (message) {
    console.log('New message arrived', message);

    socket.emit('ackNewMessage', {
        text: 'Message received by client'
    });
});

socket.on('ackCreateMessage', function (message) {
    console.log('Acknowledgement from server', message);
});

socket.on('ackCreateBroadcastMessage', function (message) {
    console.log('Acknowledgement of broadcast message from server', message);
});

socket.on('broadCastMessage', function (message) {
    console.log('New broadcast message arrived', message);

    socket.emit('ackBroadCastMessage', {
        text: 'Broadcast Message received by client'
    });
});

socket.on('welcomeMessage', function (message) {
    console.log('Welcome message from server', message);
});

socket.on('newUserAlert', function (message) {
    console.log('User alert from server', message);
});
