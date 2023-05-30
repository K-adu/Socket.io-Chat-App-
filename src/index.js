//importing libaries and files
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

//initializing instances
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//defining certain variables
const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


let count =0

io.on('connection',(socket)=>{
    console.log('new websocket connection')
    socket.emit('countUpdated')
})


app.use(express.static('public'))



//server up
server.listen(PORT,()=>{
    console.log(`server running on port no ${PORT}`)
 })