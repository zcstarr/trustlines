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
There could be better error handling. When there is a payments error the response is simply 400 and Invalid payment submission,
this should be ideally return a structured json request and return 503 when say either Alice or Bob are actually unavailable.
Logging should probably use a proper logger, with the ability to tune it for DEBUG or Non Debug mode. The project could also use 
unit tests and a could stand to be a little less coupled, ideally you'd have an abstraction around the balance, but in this case its simply a var, and probably
beyond the scope of this project. Additionally there's commandline parsing that could be more robust and easier to use.