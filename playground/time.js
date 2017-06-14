// Jan 1 1970 00:00:00 

const moment = require('moment');

// var date = new Date();

// console.log(date.getMonth());

var createdAt = 1234;

var date = moment(createdAt);
console.log(date.format('DD-MMM-YYYY'));
console.log(date.format('MMM Do YYYY'));
console.log(date.format('hh:mm a'));
console.log(date.format());