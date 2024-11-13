const http = require('http')
const express = require('express')

const app = express()

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server started in port ${PORT}`)