const socket = io()
// message form and button
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
//location form and button
const $sendLocationbutton = document.querySelector('#send-location')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML

const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
const {username, room} =  Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
const autoScroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild

    //height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.ofsetHeight + newMessageMargin

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //visible height
    const visibleHeight = $messages.offsetHeight
    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight


    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


    //visible height

}
socket.on('locationMessage',(message) =>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',  ({room, users})=>{
 const html = Mustache.render(sideBarTemplate,{
    room,
    users
 })
 document.querySelector('#sidebar').innerHTML = html
})
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable the form
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        //enable

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})



$sendLocationbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
     $sendLocationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationbutton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})



socket.emit('join', {username, room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})