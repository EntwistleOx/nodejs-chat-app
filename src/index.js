const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
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
    socket.emit('message', generateMessage('Welcome!'))

    //broadcast. -> emmits to all connections but this particular socket
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    //socket. -> emmits only to 1 connection
    socket.on('sendMessage', (message, callback) => {
        //Bad Words
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        //io. -> emmits the event to all connections
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit(
            'locationMessage', 
            generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
            )
        callback()
    })

    //Disconnect event
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

//Listening
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})