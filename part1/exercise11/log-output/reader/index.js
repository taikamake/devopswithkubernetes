const express = require('express')
const path = require('path')
const fs = require('fs').promises

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const logPath = path.join(directory, 'log.txt')
const pongPath = path.join(directory, 'pong.txt')

app.get('/logoutput', async (request, response) => {
    const logdata = await fs.readFile(logPath, 'utf-8')
    try {
        const pongdata = await fs.readFile(pongPath, 'utf-8')
        const output = '<p>' + logdata + '</p><p>Ping / Pongs: ' + pongdata + '</p>'
        response.send(output)
    } catch (error) {
        console.log('error: ' + error)
        const output = '<p>' + logdata + '</p><p>Ping / Pongs: 0</p>'
        response.send(output)
    }
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)