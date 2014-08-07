#!/usr/bin/env node

var opts = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p'
  },
  default: {
    port: process.env.PORT || 443
  }
})
var sslServer = require('./')

sslServer(opts, function(err) {
  if (err) {
    console.error('could not start server', err)
    process.exit(1)
  }
  console.log('listening on port ', opts.port)
})