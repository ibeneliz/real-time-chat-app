const users = [];

// Join user to chat
function newUser(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getActiveUser(id) {
    try {
        return users.find(user => user.id === id);
    } catch (error) {
        console.log("Error occureed in finding the active user", error);
    }
}

// User leaves chat
function exitRoom(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getIndividualRoomUsers(room) {
    try {
        return users.filter(user => user.room === room);
    } catch (error) {
        console.log("Error occureed in finding users in the room.", error);
    }
}

module.exports = {
    newUser,
    getActiveUser,
    exitRoom,
    getIndividualRoomUsers
};