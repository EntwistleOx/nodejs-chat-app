const socket = io()
const form = document.querySelector('form')
const msgTxt = document.querySelector('input')

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('click!')
//     socket.emit('increment')
// })

socket.on('welcomeMessage', (message) => {
    console.log(message)
})


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = msgTxt.value
    socket.emit('clientMessage', message)
})

socket.on('serverMessage', (message) => {
    console.log(message)
})