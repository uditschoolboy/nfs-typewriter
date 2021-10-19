const express = require('express');
const colors = require('colors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const {getUser, addUser, getUsersInRoom, removeUser, updatePosition} = require('./Utils/Users');
const getColor = require('./Utils/colors');

//set static folder
app.use(express.static(path.join(__dirname, 'frontend')));


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    socket.on('joinroom', data => {
        socket.join(data.room);

        //adding details like color and position to the objects
        data.id = socket.id;
        data.color = getColor();
        console.log(data);
        addUser(data);

        //giving the information of peers to all users
        io.to(data.room).emit('roomUsers', {
            users: getUsersInRoom(data.room)
        });
    });
    socket.on('positionUpdate', data => {
        updatePosition(socket.id, data.pos);
        console.log(data);
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('positionUpdateOthers', user);
    });
    socket.on('disconnect', data => {
        const user = getUser(socket.id);
        console.log(user.name + " left");
        removeUser(socket.id);
        io.to(user.room).emit('roomUsers', {
            users: getUsersInRoom(user.room)
        });
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000'.blue.underline);
});