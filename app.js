const express = require('express');
const path = require('path');
const logger = require('morgan');
const html = require('html');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const index = require('./routes/index');
const users = require('./routes/users');
const customizer = require('./routes/customizer');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client/build')));

app.use('/api/users', users);
app.use('/api/customizer', customizer);

const conn = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-iron-east-05.cleardb.net',
  user: 'bc48e570cd9b85',
  password: '4744d44d',
  database: 'heroku_1010cad54f61316'
});

conn.connect();

app.set('conn', conn);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(__dirname + '/error.view.html');
});

module.exports = app;
