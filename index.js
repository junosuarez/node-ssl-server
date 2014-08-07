var https = require('https')
var ecstatic = require('ecstatic')
var fs = require('fs')
var morgan = require('morgan')

function sslServer(opts, cb) {
  try {
    readCerts(opts)
  } catch (e) {
    return cb(e)
  }



  https
    .createServer(opts, server(opts))
    .listen(opts.port, cb)
}

function server(opts) {
  var log = logHandler()
  var statik = staticHandler(opts)
  return function (req, res) {
    log(req, res, function () {
      statik(req, res)
    })
  }
}

function logHandler() {
  return morgan('[:date] :method :url HTTP/:http-version :status :res[content-length] :referrer')
}

function staticHandler(opts) {
  return ecstatic({
    root: opts.root || process.cwd(),
    showDir: opts.showDir || false,
    gzip: opts.gzip || true
  })
}

function readCerts(opts) {
  if (opts.ca) {
    opts.ca = [].concat(opts.ca)
      .map(function (ca) {
        return fs.readFileSync(ca)
      })
  }

  if (opts.key) {
    opts.key = fs.readFileSync(opts.key)
  }

  if (opts.cert) {
    opts.cert = fs.readFileSync(opts.cert)
  }

  if (opts.pfx) {
    opts.pfx = fs.readFileSync(opts.pfx)
  }
}

module.exports = sslServer