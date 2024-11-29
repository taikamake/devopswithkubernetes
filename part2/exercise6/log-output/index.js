const express = require('express')
const axios = require('axios')

const app = express()

app.get('/logoutput', (request, response) => {
    axios.get('http://ping-pong:2344/pingpong').then(res => {
        console.log(res.data)
        const output = res.data
        const config = '<p>file content: ' + output.config + '</p>'
        const env = '<p>env variable: MESSAGE=' + output.env + '</p>'
        const pong = '<p>' + output.timestamp + ': ' + output.hash + '</p><p>Ping / Pongs: ' + output.score + '</p>'
        const html = config + env + pong
        response.send(html)
    })
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)