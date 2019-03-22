const yargs = require('yargs')

const { argv } = yargs
const restify = require('restify')
const request = require('request-promise-native')
const config = require('./config')

// Some light validation on the server name coming from args
const validateSender = (sender) => {
  if (!config[sender]) throw new Error('Invalid server name,  try servername: alice or bob')
}

// Setup some additional server autot parsing and sets initial server balance
const configServer = (server) => {
  server.use(restify.plugins.acceptParser(server.acceptable))
  server.use(restify.plugins.queryParser({ mapParams: true }))
  server.use(restify.plugins.bodyParser({ mapParams: true }))
  server.balance = 0
}

// Returns payment function configured for alice or bob
const sendPaymentRequest = (paymentPort) => {
  return (amount) => {
    const req = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      uri: `http://localhost:${paymentPort}/recieve`,
      body: {
        amount
      },
      json: true
    }
    return request.post(req)
  }
}

const configApp = (sender) => {
  const port = config[sender]
  let paymentPort
  let recipient
  if (sender === 'alice') {
    paymentPort = config.bob
    recipient = 'bob'
  } else {
    paymentPort = config.alice
    recipient = 'alice'
  }

  return {
    pay: sendPaymentRequest(paymentPort),
    recipient,
    name: sender,
    port
  }
}

const routes = (server, cfg) => {
  server.post('/send', async (req, res, next) => {
    let amount
    try {
      amount = parseFloat(req.params.amount)
      if (isNaN(amount)) throw new Error('Invalid amount attempted to be sent')
      console.log(`Paying ${amount} to ${cfg.recipient}`)
      await cfg.pay(req.params.amount)
      console.log('Sent')
      server.balance -= amount
      console.log(`Trustline balance is: ${server.balance}`)
      res.status(200)
      res.send({ amount })
    } catch (err) {
      // TODO should be more robust error handling 400 is just a catch all
      res.status(400)
      res.send('Failed to submit payment')
      console.error(err)
      next(err)
    }
  })

  server.post('/recieve', async (req, res, next) => {
    let amount
    console.log(`Receiving payment ${req.params.amount}`)
    try {
      amount = parseFloat(req.params.amount)
      if (isNaN(amount)) throw new Error('Invalid Amount sent')
      server.balance += amount
      console.log(`You were paid ${amount}!`)
      console.log(`Trustline balance is: ${server.balance}`)
      res.status(200)
      res.send({})
      next()
    } catch (err) {
      res.status(400)
      res.send('Failed to recieve payment')
      console.error(err)
      next(err)
    }
  })
}

// Start server
function start () {
  let sender
  const argv = yargs
    .usage('Usage: $0 --sender [person] ex: --sender alice')
    .demandOption(['sender'])
    .check((argv) => {
      sender = argv.sender
    if (sender === true) { 
      throw new Error('Sender not specified try alice or bob')
    }
    sender = sender.toLowerCase()
    validateSender(sender)
    return true
    }).argv


  const server = restify.createServer({
    name: 'Trustline',
    version: '0.0.1'
  })

  const appCfg = configApp(sender)
  configServer(server)
  routes(server, appCfg)

  server.listen(appCfg.port, () => {
    console.log(`Welcome to Trustline.\nYour Trustline balance is ${server.balance}.`)
  })
}

start()
