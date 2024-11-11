const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('')
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server started in port ${PORT}`)