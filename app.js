const express = require('express')

const app = express()

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const port = 5500
app.listen(port, _ => console.log(`Listening on port: ${port}`))