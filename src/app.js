const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
require('./db.js');

// const server = express();

// server.use(cors());

const server = express()

server.name = 'API';
server.use(express.json())

server.use(cors([
  {
      origin: "https://pi-dogs-sooty.vercel.app", //servidor que deseas que consuma o (*) en caso que sea acceso libre
      credentials: true
  }
]))
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
server.use(bodyParser.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
server.use(cookieParser())
server.use(morgan('dev'))

server.use('/', routes);
// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;

