const express = require('express')
const app = express()
const port = 8000
const FluentClient = require('@fluent-org/logger').FluentClient;

const logger = new FluentClient('fluentd.test', {
    socket: {
      host: 'localhost',
      port: 8080,
      timeout: 3000, // 3 seconds
    }
  });

app.get('/', (req, res) => {
  const query = req.query;
  logger.emit('Query', {query})
  res.send(query)
})

app.listen(port, () => {
  logger.emit('App', {data: 'App started listening', port})
  console.log(`Example app listening on port ${port}`)
})