const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())
const pool = new Pool({
	user: process.env.USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
})

app.get('/todos', async (request, response) => {
    const res = await pool.query('SELECT * FROM todos')
    console.log('res: ' + res.rows[0])
    const todos = res.rows.map((x) => x.text)
    response.send(todos)
})

app.post('/todos', async (request, response) => {
    console.log(request.body)
    const todo = request.body.text
    await pool.query('INSERT INTO todos (text) VALUES ($1)', [todo])
})

const initializeDatabase = async () =>  {
    const result = await pool.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'todos'
        ) AS table_exists`
    )
    if (!result.rows[0].table_exists) {
        console.log('starting init')
        try {
            await pool.query(`CREATE TABLE todos (
              id SERIAL PRIMARY KEY,
              text varchar(255)
              )`
            )
            await pool.query(`INSERT INTO todos (text) VALUES ('todo1')`)
            await pool.query(`INSERT INTO todos (text) VALUES ('todo2')`)
        } catch (err) {
            console.error("init error", err)
        }
    }
}

initializeDatabase()
const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
