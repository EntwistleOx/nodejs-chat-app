const socket = io()
const form = document.querySelector('#message-form')
const btnLocation = document.querySelector('#send-location')
// const msgTxt = document.querySelector('input')

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('click!')
//     socket.emit('increment')
// })

socket.on('message', (message) => {
    console.log(message)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if(error) {
            return console.log(error)
        } 
        console.log('Message delivered!')
    })
})

btnLocation.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})