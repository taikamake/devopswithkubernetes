const express = require('express')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const schedule = require('node-schedule')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'image.jpg')

const fileAlreadyExists = async () => new Promise(res => {
    fs.stat(filePath, (err, stats) => {
        if (err || !stats) return res(false)
        return res(true)
    })
})

const findAFile = async () => {
    if (await fileAlreadyExists()) return
    await new Promise(res => fs.mkdir(directory, (err) => res()))
    const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream(filePath))
}

const removeFile = async () => new Promise(res => fs.unlink(filePath, (err) => res()))

const changeImage = async () => {
    await removeFile()
    await findAFile()
}

app.get('/', (request, response) => {
    response.send('<img src="/image" alt="random image" />')
})

app.get('/image', (request, response) => {
    fs.readFile(filePath, (err, image) => {
        if (err) return
        response.writeHead(200, { 'Content-Type': 'image/jpg' })
        response.end(image)
    })
})

findAFile()
const job = schedule.scheduleJob('10 * * * *', () => {
    changeImage()
})
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
