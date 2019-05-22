const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const { addUser, getUser, getUsersInRoom, removeUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;

const dirPath = path.join(__dirname, '../public');

app.use(express.static(dirPath));

io.on("connection", (socket) => {
    console.log('New Web Socket Connection');

    socket.on('newUser', (options, callback) => {
        if (getUsersInRoom(options.room).length >= 2) return callback('More than two players not allowed');

        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) return callback(error)

        socket.join(user.room);
        callback();
    })


    socket.on('cellClickEvent', (options, callback) => {
        if (getUsersInRoom(options.user.room).length !== 2) return callback('','opponent not joined')
        console.log(options)
        const user = getUser(socket.id);
        if (options.user.username === user.username) {
            io.to(options.user.room).emit('cellClickEventResponse', options);
            callback(options);
        }

    })

});


server.listen(port, () => {
    console.log(`The server started in port ${port}`);
});