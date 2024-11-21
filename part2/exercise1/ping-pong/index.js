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

const removeFile = async () => new Promise(res => fs.unlink(filePath, (err) => res()))

const createFile = async () => {
    if (await fileAlreadyExists()) return
    await new Promise(res => fs.mkdir(directory, { recursive: true }, (err) => res()))
    fs.createWriteStream(filePath, 'utf8')
    const initialOutput = {
        timestamp: 'NA',
        hash: 'NA',
        score: 0
    }
    const initialString = JSON.stringify(initialOutput)
    console.log('INITIAL STRING: ' + initialString)
    fs.writeFileSync(filePath, initialString, error => {
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
        console.log('HERE IS THE DATA')
        console.log(data)
        let dataObj = {}
        try {
            dataObj = JSON.parse(data)
        }
        catch(err) {
            dataObj = {
                timestamp: 'NA',
                hash: 'NA',
                score: 0
            }
        }
        const score = dataObj.score + 1
        const timestamp = new Date().toLocaleString()
        const hash = crypto.createHash('sha256').update(timestamp).digest('hex')
        const output = {
            timestamp: timestamp,
            hash: hash,
            score: score
        }
        const newString = JSON.stringify(output)
        fs.writeFileSync(filePath, newString, error => {
            if (error) {
                console.log(error)
            }
        })
        response.send(dataObj)
    })
})

const PORT = 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
