const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const config = require('./config.json');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    // During development, enable CORS on your server.
    cors: {
        origin: `http://localhost:${config.REACT_PORT_NUMBER}`
    }
});

app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});

io.on("connection", (socket) => {
    console.log("A new user connected: ", socket.id);
    socket.on("content-changed", (content) => {
        // This will broadcast the new content to all the connected sockets,
        // except the socket which initiated the event.
        socket.broadcast.emit("new-content-received", content);
    });
    socket.on("draw-new-canvas", (coords) => {
        socket.broadcast.emit("new-canvas-received", coords);
    });
});

server.listen(config.SERVER_PORT_NUMBER, () => {
    console.log(`Server up & running at http://localhost:${config.SERVER_PORT_NUMBER}`);
});
