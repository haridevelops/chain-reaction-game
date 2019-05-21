const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const CurrentUser = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;

const dirPath = path.join(__dirname, '../public');

app.use(express.static(dirPath));

io.on("connection", (socket) => {
    console.log('New Web Socket Connection');

    socket.on('cellClickEvent', (index, callback) => {
        if (CurrentUser === index.user) 

        CurrentUser = index.user;
        callback(index);
    })
});


server.listen(port, () => {
    console.log(`The server started in port ${port}`);
});