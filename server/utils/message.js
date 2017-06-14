const moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt : moment().valueOf()
    }
}

var generateLocationMessage = (from, lat, long) => {
    return {
        from,
        URL : `https://www.google.be/maps/search/${lat},${long}`,
        createdAt : moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage}