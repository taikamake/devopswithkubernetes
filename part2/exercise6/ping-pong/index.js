const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const app = express()
const pongDirectory = path.join('/', 'usr', 'src', 'app', 'files')
const pongFilePath = path.join(pongDirectory, 'log.txt')
const configDirectory = path.join('/', 'usr', 'src', 'app', 'config')
const configFilePath = path.join(configDirectory, 'config.txt')

const fileAlreadyExists = async () => new Promise(res => {
    fs.stat(pongFilePath, (err, stats) => {
        if (err || !stats) return res(false)
        return res(true)
    })
})

const removeFile = async () => new Promise(res => fs.unlink(pongFilePath, (err) => res()))

const createFile = async () => {
    if (await fileAlreadyExists()) return
    await new Promise(res => fs.mkdir(pongDirectory, { recursive: true }, (err) => res()))
    fs.createWriteStream(pongFilePath, 'utf8')
    const initialOutput = {
        timestamp: 'NA',
        hash: 'NA',
        score: 0
    }
    const initialString = JSON.stringify(initialOutput)
    console.log('INITIAL STRING: ' + initialString)
    fs.writeFileSync(pongFilePath, initialString, error => {
        if (error) {
            console.log(error)
        }
    })
}

app.get('/pingpong', (request, response) => {
    createFile()
    let dataObj = {}
    fs.readFile(pongFilePath, 'utf-8', (error, pongdata) => {
        if (error) {
            console.log(error)
            return
        }
        console.log('HERE IS THE DATA')
        console.log(pongdata)
        try {
            dataObj = JSON.parse(pongdata)
        }
        catch(err) {
            dataObj = {
                timestamp: 'NA',
                hash: 'NA',
                score: 0
            }
        }
        fs.readFile(configFilePath, 'utf-8', (error, configdata) => {
            if (error) {
                console.log(error)
                return
            }
            console.log('HERE IS THE CONFIG')
            console.log(configdata)
            dataObj.config = configdata
            dataObj.env = process.env.MESSAGE
            if (dataObj.score == null) {dataObj.score = 0}
            const score = dataObj.score + 1
            const timestamp = new Date().toLocaleString()
            const hash = crypto.createHash('sha256').update(timestamp).digest('hex')
            const output = {
                timestamp: timestamp,
                hash: hash,
                score: score
            }
            const newString = JSON.stringify(output)
            fs.writeFileSync(pongFilePath, newString, error => {
                if (error) {
                    console.log(error)
                }
            })
            response.send(dataObj)
        })
    })
})

const PORT = 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
