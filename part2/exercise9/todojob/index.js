const { Pool } = require('pg')
const fetch = require('node-fetch')

const pool = new Pool({
	user: process.env.USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
})

const getTodo = async () =>  {
    try {
        const res = await fetch('https://en.wikipedia.org/wiki/Special:Random', { method: 'HEAD', redirect: 'manual' })
        const location = res.headers.get('Location')
        const text = 'READ ' + location
        await pool.query(`INSERT INTO todos (text) VALUES ($1)`, [text])
    } catch (err) {
        console.error("job error", err)
    }
}

getTodo()