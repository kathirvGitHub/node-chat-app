var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt : new Date().getTime()
    }
}

var generateLocationMessage = (from, lat, long) => {
    return {
        from,
        URL : `https://www.google.be/maps/search/${lat},${long}`,
        createdAt : new Date().getTime()
    }
}

module.exports = {generateMessage, generateLocationMessage}