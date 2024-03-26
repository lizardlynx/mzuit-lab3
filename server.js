const express = require('express');
const axios = require('axios');
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

const link = 'https://openlibrary.org/search.json';

app.get('/', (req, res) => {
  const params = req.query;
  console.log('Calling with parameters ', params);
  logger.emit('Query params', {params});
  const response = axios.get(link, {params})
  logger.emit('Response', {response})

  res.send(response)
});



app.listen(port, () => {
  logger.emit('App', {data: 'App started listening', port})
  console.log(`Example app listening on port ${port}`)
})