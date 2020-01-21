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

    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //     //Emmits only to 1 connection
    //     //socket.emit('countUpdated', count)
    //     //Emmits the event to all connections
    //     io.emit('countUpdated', count)
    // })

    const message = 'Welcome!'
    socket.emit('welcomeMessage', message)

    socket.on('clientMessage', (message) => {
        io.emit('serverMessage', message)
    })


})

//Listening
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})