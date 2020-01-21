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

//Connection event 
io.on('connection', () => {
    console.log('New websocket connection!')
})

//Listening
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})