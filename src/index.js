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
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
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

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        //Bad Words Filter
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit(
            'locationMessage',
            generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        )
        callback()
    })

    //Disconnect event
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

//Listening
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})

