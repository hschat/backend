# chat-backend

[![Build Status](https://travis-ci.org/hschat/backend.svg?branch=master)](https://travis-ci.org/hschat/backend)    [![Maintainability](https://api.codeclimate.com/v1/badges/47852681ba3b4702a364/maintainability)](https://codeclimate.com/github/hschat/backend/maintainability)   [![Test Coverage](https://api.codeclimate.com/v1/badges/47852681ba3b4702a364/test_coverage)](https://codeclimate.com/github/hschat/backend/test_coverage) 

## Requirements

### Linux / Windows (WSL)

```bash
# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Install postgresql
sudo apt-get install -y postgresql postgresql-client
sudo vim /etc/postgresql/9.5/main/pg_hba.conf
#
# Find the following line 
#
#   host    all             all             127.0.0.1/32            md5
#
# and add the following above it:
#
#   host    all             postgres        127.0.0.1/32            trust
#
sudo service postgresql start 
```

### macOS

```bash
# For homebrew
brew install node@8 yarn postgresql

# else check 
# - https://nodejs.org/en/
# - https://yarnpkg.com/en/docs/install
# - https://www.postgresql.org/
```

## Setup

```bash
# Change into the direcotry of the project
yarn install

# On Windows
sudo -u postgres createdb -O postgres hschat
# On macOS
createdb -O postgres hschat

node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```

## Running it

```
yarn start
# Access it at localhost:3030
```

## Troubleshooting
### The Node Version is incompatible
```
The engine "node" is incompatible with this module. Expected version "^8.0.0". Got "10.12.0"
```
Solution: Navigate to the package.json and change the value "8.0.0" to "10.12.0"

### Postgres role error
```
could not connect to database postgres: FATAL: role "******" does not exist
```
Solution: run the following commands
```
sudo -u postgres -i
createdb -O postgres hschat
```

### Postgres connect error
```
createdb: could not connect to database template1: could not connect to server: No such file or directory
```
Solution macOs: 
```
brew services start postgresql
```
Solution linux:
```
service postgresql start
```


### Postgres authentification error
You missed the pg_hba.conf step

### Yarn does not install on Ubuntu
Solution: run the following commands
```
apt-get purge yarn
apt-get purge cmdtest
apt-get autoclean
apt-get update
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```






