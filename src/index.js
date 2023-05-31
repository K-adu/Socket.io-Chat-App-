//defininf global variable
const PORT = process.env.PORT || 3000

//loading third parties libraribes and framworks
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')

// instantiate express and httpServer
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//defining the public client side path
const publicBaseDirectory = path.join(__dirname,'../public') 
app.use(express.static(publicBaseDirectory))

io.on('connection',(socket)=>{
    console.log('connection established client connected')
    welcomeText = 'welcome user'
    socket.emit('message',welcomeText)

    socket.on('sendMessage',(message)=>{
        io.emit('sendmessageserver',message)
    })

})


// server listening to port no 3000
server.listen(PORT,()=>[
    console.log(`server running in port number ${PORT}`)
])


