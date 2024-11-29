const express = require('express')
const axios = require('axios')

const app = express()

app.get('/logoutput', (request, response) => {
    axios.get('http://ping-pong:2344/pingpong').then(res => {
        console.log(res.data)
        const output = res.data
        const html = '<p>' + output.timestamp + ': ' + output.hash + '</p><p>Ping / Pongs: ' + output.score + '</p>'
        response.send(html)
    })
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)