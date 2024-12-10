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
}
createFile()
const PORT = 3002
app.listen(PORT)
console.log(`Server started in port ${PORT}`)

setInterval(() => {
    const timestamp = new Date().toLocaleString()
    const hash = crypto.createHash('sha256').update(timestamp).digest('hex')
    const output = timestamp + ': ' + hash
    fs.writeFileSync(filePath, output, error => {
        if (error) {
            console.log(error)
        }
    })
}, 5000)