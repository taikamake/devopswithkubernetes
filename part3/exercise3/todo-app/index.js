const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const schedule = require('node-schedule')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'image.jpg')
app.use(bodyParser.urlencoded({ extended: true }))

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

app.get('/home', (request, response) => {
    axios
    .get('http://todo-backend:2345/todos')
    .then(res => {
        const image = '<img src="/home/image" alt="random image" width="400"/>'
        const form = '<form method="POST" action="/home/submit"><input type="text" name="todo" maxlength="140" /><input type="submit" value="Create TODO"></form>'
        const todos = res.data
        const list = todos.map((todo) => '<li>' + todo + '</li>')
        const html = image + form + '<ul>' + list.join('') + '</ul>'
        response.send(html)
    })
})

app.get('/home/image', (request, response) => {
    findAFile()
    fs.readFile(filePath, (err, image) => {
        if (err) return
        response.writeHead(200, { 'Content-Type': 'image/jpg' })
        response.end(image)
    })
})

app.post('/home/submit', (request, response) => {
    const todo = JSON.stringify({text: request.body.todo})
    console.log(todo)
    axios.post('http://todo-backend:2345/todos', todo, {
        headers: {
          'Content-Type': 'application/json'
        }
    })
    response.redirect('/home')
})

findAFile()
const job = schedule.scheduleJob('10 * * * *', () => {
    changeImage()
})
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
