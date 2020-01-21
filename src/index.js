const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT | 3000

app.use(express.json())
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
