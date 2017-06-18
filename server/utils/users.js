// [{
//     id : 'socket ID',
//     name : 'name',
//     room : 'room name'
// }]

// addUser(id, name, room)

class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        var user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    getUser(id){
        var usersByID = this.users.filter((user) => {
            return user.id === id;
        });
        return usersByID[0];
    }

    removeUser(id){
        var removedUser = this.getUser(id);
        var usersOtherIDs = this.users.filter((user) => {
            return user.id !== id;
        });
        this.users = usersOtherIDs;
        return removedUser;
    }

    

    getUsersList(room){
        var usersByRoom = this.users.filter((user) => {
            return user.room === room;
        });
        var namesArray = usersByRoom.map((user) => {
            return user.name;
        })
        return namesArray;
    }

}

module.exports = {Users};