# Trustline 


This is a quick project to demonstrate a trustline.  

## Getting Started
Install node v11 > 
```sh
git clone git@github.com/zcstarr/trustline
npm install
```

After running install:

Run both servers 
```sh
node ./server --alice
```

```sh
node ./server --bob
```
In yet another term run a client

```sh
node ./client
```
Next we start to transfer payments 
```sh
at the prompt we enter
alice:100
then...
bob:100
then:
alice:7331
bob:1337
exit
```

## Some things that could be better 
There could be better error handling. When there is a payments error the response is simply 400 and Invalid payment submission, this should ideally return a structured json request and return proper HTTP response codes when say either Alice or Bob are actually unavailable.

Logging should probably use a proper logger, with the ability to tune it for env (aka debug/staging/prod). The project could also use unit tests and a could stand to be a little less coupled, for instance ideally you'd have an abstraction around the balance, but in this case its simply a var on the server object. 

Additionally there's commandline parsing that could be more robust and the actual interface itself a little more user friendly
