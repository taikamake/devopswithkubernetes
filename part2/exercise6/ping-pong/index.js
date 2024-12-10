const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pong.txt')

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
    fs.writeFileSync(filePath, '0', error => {
        if (error) {
            console.log(error)
        }
    })
}

app.get('/pingpong', async (request, response) => {
    await createFile()
    await fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        let score = parseInt(data)
        if (!Number.isInteger(score)) {score = 0}
        const count = score + 1
        const output = count.toString()
        fs.writeFileSync(filePath, output, error => {
            if (error) {
                console.log(error)
            }
        })
        response.send('pong ' + score)
    })
})


const PORT = 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
