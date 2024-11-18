const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'log.txt')

const fileAlreadyExists = async () => new Promise(res => {
    fs.stat(filePath, (err, stats) => {
        if (err || !stats) return res(false)
        return res(true)
    })
})

const createFile = async () => {
    if (await fileAlreadyExists()) return
    await new Promise(res => fs.mkdir(directory, { recursive: true }, (err) => res()))
    fs.createWriteStream(filePath, 'utf8')
    fs.writeFileSync(filePath, 'NA-Ping / Pongs: -0', error => {
        if (error) {
            console.log(error)
        }
    })
}

app.get('/pingpong', (request, response) => {
    createFile()
    fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        const splitdata = data.split('-')
        const count = parseInt(splitdata[2]) + 1
        const timestamp = new Date().toLocaleString()
        const hash = crypto.createHash('sha256').update(timestamp).digest('hex')
        const output = timestamp + ': ' + hash + '.-Ping / Pongs: -' + count
        fs.writeFileSync(filePath, output, error => {
            if (error) {
                console.log(error)
            }
        })
        response.send(splitdata[1] + splitdata[2])
    })
})

const PORT = 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
