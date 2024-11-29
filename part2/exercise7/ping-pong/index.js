const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { Pool } = require('pg')

const app = express()
const pool = new Pool({
	user: process.env.USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
})

const configDirectory = path.join('/', 'usr', 'src', 'app', 'config')
const configFilePath = path.join(configDirectory, 'config.txt')

app.get('/pingpong', async (request, response) => {
    fs.readFile(configFilePath, 'utf-8', async (error, data) => {
        if (error) return
        const res = await pool.query('SELECT * FROM pingpong')
        console.log('res: ' + res.rows[0].score + res.rows[0].id)
        const score = res.rows[0].score
        const newScore = score + 1
        const timestamp = new Date().toLocaleString()
        const hash = crypto.createHash('sha256').update(timestamp).digest('hex')
        const output = {
            timestamp: timestamp,
            hash: hash,
            score: score,
            config: data,
            env: process.env.MESSAGE
        }
        await pool.query('UPDATE pingpong SET score = $1 WHERE id=1', [newScore])
        response.send(output)
    })
})


const initializeDatabase = async () =>  {
    const result = await pool.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'pingpong'
        ) AS table_exists`
    )
    if (!result.rows[0].table_exists) {
        console.log('starting init')
        try {
            await pool.query(`CREATE TABLE pingpong (
              id SERIAL PRIMARY KEY,
              score INTEGER NOT NULL
              )`
            )
            await pool.query(`INSERT INTO pingpong (score) VALUES (0)`)
        } catch (err) {
            console.error("init error", err)
        }
    }
}

initializeDatabase()
const PORT = 3001
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
