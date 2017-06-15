var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');  

    // socket.emit('createMessage', {
    //     text : 'Second message',
    //     to : 'User B',
    //     from : 'User A'
    // });  
});

socket.on('disconnect', function () {
    console.log('Server disconnected');
});

// socket.on('newMessage', function (message) {
//     console.log('New message arrived', message);

//     socket.emit('ackNewMessage', {
//         text: 'Message received by client'
//     });
// });

// socket.on('ackCreateMessage', function (message) {
//     console.log('Acknowledgement from server', message);
// });

// socket.on('ackCreateBroadcastMessage', function (message) {
//     console.log('Acknowledgement of broadcast message from server', message);
// });

socket.on('broadCastMessage', function (message) {
    // console.log('New broadcast message arrived', message);

    // socket.emit('ackBroadCastMessage', {
    //     text: 'Broadcast Message received by client'
    // });
    // var formattedTime = moment(message.createdAt).format('hh:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);

    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

// socket.on('welcomeMessage', function (message) {
//     console.log('Welcome message from server', message);
// });

// socket.on('newUserAlert', function (message) {
//     console.log('User alert from server', message);
// });

// socket.emit('createMessagewithAck', {
//         text : 'Message with Acknowledgement',
//         from : 'User A'
//     }, function(message) {
//         console.log('Acknowledged!', message);
//     });  

socket.on('newLocationMessage', function (message) {
    
    // var formattedTime = moment(message.createdAt).format('hh:mm a');
    // var li = jQuery('<li></li>');
    // var a =jQuery('<a target="_blank">My current location</a>');


    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.URL);

    // li.append(a);

    // jQuery('#messages').append(li);

    var formattedTime = moment(message.createdAt).format('hh:mm a');

    var template = jQuery('#locationmessage-template').html();
    var html = Mustache.render(template, {
        text : 'My current location',
        from : message.from,
        createdAt : formattedTime,
        url : message.URL
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createBroadcastMessage', {
        text : messageTextbox.val(),
        from : 'User'
    }, function(message) {
        messageTextbox.val('');
    });  
})

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }    

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position){
        // console.log(position);
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    }, function (){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    })
})

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}