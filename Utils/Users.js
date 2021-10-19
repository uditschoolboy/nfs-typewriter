let users = [];

const getUser = id => users.find(user => user.id === id);

const addUser = user => users.push(user);

const removeUser = id => users = users.filter(user => user.id !== id);

const getUsersInRoom = room => users.filter(user => user.room === room);

const updatePosition = (id, position) => {
    const idx = users.findIndex(user => user.id === id);
    users[idx].pos = position;
}

module.exports = {
    getUser,
    addUser,
    removeUser,
    getUsersInRoom,
    updatePosition
}