const socket = io()
const form = document.querySelector('#message-form')
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
    socket.emit('sendMessage', message)
})