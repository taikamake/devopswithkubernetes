const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'log.txt')

app.get('/logoutput', (request, response) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        const splitdata = data.split('-')
        const output = '<p>' + splitdata[0] + '</p>' + '<p>' + splitdata[1] + splitdata[2] + '</p>'
        response.send(output)
    })
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)