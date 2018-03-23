const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const mysql = require('mysql');

const app = module.exports = express();
const users = require('./server/users');
const customizer = require('./server/customizer');
const shop = require('./server/shop');

require('dotenv').config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const conn = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

app.set('conn', conn);

app.use('/api/users', users);
app.use('/api/customizer', customizer);
app.use('/api/shop', shop);

app.use(express.static(path.join(__dirname, 'client/build')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nanobrewery listening on port: ${PORT}`);
});

module.exports = app;
