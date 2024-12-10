const express = require('express')
const { Pool } = require('pg')

const app = express()
const pool = new Pool({
	user: process.env.USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
})

app.get('/pingpong', async (request, response) => {
    try {
        const res = await pool.query('SELECT * FROM pingpong')
        const score = res.rows[0].score
        const newScore = score + 1
        await pool.query('UPDATE pingpong SET score = $1 WHERE id=1', [newScore])
        console.log('pong ' + score)
        response.send('pong ' + score)
    } catch (error) {
        console.log('error: ' + error)
        response.send('pong 0')
    }
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
