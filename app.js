const express = require('express');
const path = require('path');
const logger = require('morgan');
const html = require('html');
const bodyParser = require('body-parser');

const mysql = require('mysql');

const app = module.exports = express();
const index = require('./routes/index');
const users = require('./routes/users');
const customizer = require('./routes/customizer');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const conn = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-iron-east-05.cleardb.net',
  user: 'bc48e570cd9b85',
  password: '4744d44d',
  database: 'heroku_1010cad54f61316'
});

app.set('conn', conn);

app.use('/api/users', users);
app.use('/api/customizer', customizer);

app.use(express.static(path.join(__dirname, 'client/build')))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nanobrewery listening on port: ${PORT}`);
});

module.exports = app;
