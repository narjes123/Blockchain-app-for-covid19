require('dotenv').config();
const { init_web3 } = require('./server-utils/web3-util.js');
init_web3();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MetaAuth = require('meta-auth');
const app = express();
const metaAuth = new MetaAuth();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

require('./routes/auth-routes')(app, metaAuth);

app.listen(9090, () => console.log("server up and listening at 9090"));

module.exports = app;