const express = require('express');
const app = express()
const port = 9091
const Prometheus = require('prom-client')

const metricsInterval = Prometheus.collectDefaultMetrics()
const checkoutsTotal = new Prometheus.Counter({
  name: 'checkouts_total',
  help: 'Total number of checkouts',
  labelNames: ['payment_method']
})
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
})

app.get('/checkout', (req, res, next) => {
  const paymentMethod = Math.round(Math.random()) === 0 ? 'stripe' : 'paypal'

  checkoutsTotal.inc({
    payment_method: paymentMethod
  })

  res.json({ status: 'ok' })
  next()
})

app.get('/metrics', async (req, res, next) => {

  res.set('Content-Type', Prometheus.register.contentType)
  res.end(await Prometheus.register.metrics())
  next()
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})