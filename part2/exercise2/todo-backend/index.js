const express = require('express')

const app = express()
app.use(express.json())
let todos = ['todo1', 'todo2']

app.get('/todos', (request, response) => {
    response.send(todos)
})

app.post('/todos', (request, response) => {
    console.log(request.body)
    todos = todos.concat(request.body.text)
})

const PORT = 3000
app.listen(PORT)
console.log(`Server started in port ${PORT}`)
