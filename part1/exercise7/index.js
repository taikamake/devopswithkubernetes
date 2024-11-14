const express = require('express')

const app = express()

const createString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = Math.floor(Math.random() * 10) + 1
    let output = ''
    for (let i = 0; i < length; i++) {
        output += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return output
}

app.get('/logoutput', (request, response) => {
    response.send('<h1>' + new Date().toLocaleString() + ': ' + output + '</h1>')
})

const PORT = 3002
app.listen(PORT)
console.log(`Server started in port ${PORT}`)

const output = createString()
console.log(new Date().toLocaleString() + ': ' + output)
setInterval(() => {
    console.log(new Date().toLocaleString() + ': ' + output)
}, 5000);