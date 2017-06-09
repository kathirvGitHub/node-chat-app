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

