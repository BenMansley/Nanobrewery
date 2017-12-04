const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/all', function(req, res, next) {
  req.app.settings.conn.query('SELECT * FROM users', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/email/:email', function(req, res, next) {
  req.app.settings.conn.query(`SELECT * FROM Users WHERE email='${req.params.email}'`, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

router.post('/', function(req, res, next) {
  const { email, password } = req.body;
  
  req.app.settings.conn.query(`SELECT * FROM Users WHERE email='${email}'`, (error, results, fields) => {
    if (error) return res.status(500).json(error);
    if (results.length === 0) return res.status(400).json('User not found with that email');
    bcrypt.compare(password, results[0].password, (err, match) => {
      if (!match) return res.status(400).json('Password Incorrect');
      delete results[0].password;
      return res.json(results[0]);
    });
  });
});


router.post('/new', function(req, res, next) {
  const { email, name, password, companyName } = req.body;

  bcrypt.hash(password, 10, function(error, hash) {
    if (error) return res.status(500).json(error);

    let queryString = `SELECT * FROM Users WHERE email='${email}'`;
  
    req.app.settings.conn.query(queryString, (error, results, fields) => {
      if (error) return res.status(500).json(error);
      if (results.length !== 0) return res.status(400).json('A user with that email already exists');
      queryString = `INSERT INTO Users (email, password, name, companyName)
                      VALUES ('${email}','${hash}','${name}','${companyName}')`;
  
      req.app.settings.conn.query(queryString, (error, results, fields) => {
        if (error) throw error;
        res.json({ id: results.insertId, name, email, companyName });
      });
    });
  })
});

module.exports = router;
