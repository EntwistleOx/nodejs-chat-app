const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const port = process.env.PORT || 3000

//Create APP
const app = express()

const server = http.createServer(app)
const io = socketio(server)

//Paths
const publicPath = path.join(__dirname, '../public')

//Middleware
app.use(express.static(publicPath))

// let count = 0

//Connection event 
//param socket is an object and contains info about new connections
io.on('connection', (socket) => {
    console.log('New websocket connection!')
    const message = 'Welcome!'
    socket.emit('message', message)

    //broadcast. -> emmits to all connections but this particular socket
    socket.broadcast.emit('message', 'A new user has joined!')

    //socket. -> emmits only to 1 connection
    socket.on('sendMessage', (message) => {
        //io. -> emmits the event to all connections
        io.emit('message', message)
    })

    //Disconnect event
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})



//Listening
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})