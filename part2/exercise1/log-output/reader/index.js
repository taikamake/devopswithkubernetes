const express = require('express')
const path = require('path')
const fs = require('fs').promises
const axios = require('axios')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const logPath = path.join(directory, 'log.txt')

app.get('/logoutput', async (request, response) => {
    try {
        const logdata = await fs.readFile(logPath, 'utf-8')
        const pong = await axios.get('http://ping-pong-svc:2344/pingpong')
        const pongdata = pong.data
        const score = pongdata.split(' ')
        const output = '<p>' + logdata + '</p><p>Ping / Pongs: ' + score[1] + '</p>'
        response.send(output)
    } catch (error) {
        console.log('error: ' + error)
        const output = '<p>Ping / Pongs: 0</p>'
        response.send(output)
    }
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)