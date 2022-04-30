Kindly follow this guide to set up all the neccessary dependencies for the project

### download the nvm enviornment, you may skip it if you already have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

nvm install 10

nvm alias default 10

node --version

npm --version


### download the mongoDB environment, you may skip it if you already have it
apt install gnupg

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

apt update

apt install mongodb-org

mkdir -p /data/db


### static web server setup
### Go to the ui directory and execute the following commands:
npm insatll

npm run compile

npm start


### API server setup
### Go to the api directory and execute the following commands:
npm install

screen mongod

node scripts/init.mongo.js

npm start
