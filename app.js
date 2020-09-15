const express = require('express')
require('dotenv').config();

const app = express()

app.use(express.static(__dirname + '/dist'))

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const port = process.env.PORT || 3000
app.listen(port, _ => console.log(`Listening on port: ${port}`))