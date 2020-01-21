const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000

//Create APP
const app = express()

//Paths
const publicPath = path.join(__dirname, '../public')

//Middleware
app.use(express.static(publicPath))

//Listening
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})