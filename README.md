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
sudo vim /etc/postgresql/<YOUR VERSION>/main/pg_hba.conf
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


