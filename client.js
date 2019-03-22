const readline = require('readline')
const request = require('request-promise-native')
const config = require('./config')

const sendPayment = ({ server, value }) => {
  const req = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    uri: `http://localhost:${config[server]}/send`,
    body: { amount: value },
    json: true
  }
  return request.post(req)
}

const parseCommand = (command) => {
  if (!command) throw new Error('Invalid command')
  const args = command.split(':')
  if (args.length !== 2) throw new Error('Invalid command: wrong number of args')
  if (args[0].toLowerCase() !== 'alice' && args[0].toLowerCase() !== 'bob') throw new Error('Invalid command: unknown people')
  const value = parseFloat(args[1])
  if (isNaN(value)) throw new Error('Money sent is NaN')
  if (value < 0) throw new Error('Money sent must be postive')

  return { value, server: args[0].toLowerCase() }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.setPrompt('Send money via the following server:money ex. alice:100 or bob:100 or exit\n')
rl.prompt()
rl.on('line', async (command) => {
  if (command === 'exit') {
    process.exit(0)
  }
  try {
    const paymentInfo = parseCommand(command)
    await sendPayment(paymentInfo)
  } catch (err) {
    console.error(err)
  }
})
  .on('close', () => {
    process.exit(0)
  })
