/**
* socket.emit -> send events to specific client
* io.emit -> send events to every connected client
* socket.broadcast.emit -> send events to every connected client except this one
* io.to.emit -> send events to every connected client in a specific room
* socket.broadcast.to.emit -> send events to every connected client except this one, limited to a specific room
*/
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

//Connection event 
//param socket is an object and contains info about new connections
io.on('connection', (socket) => {
    console.log('New websocket connection!')

    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!')) 
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    })

    socket.on('sendMessage', (message, callback) => {
        //Bad Words Filter
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to('Santiago').emit('message', generateMessage(message))
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

