const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/all', (req, res, next) => {
  req.app.settings.conn.query('SELECT * FROM Users', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/email/:email', (req, res, next) => {
  req.app.settings.conn.query(`SELECT * FROM Users WHERE email='${req.params.email}'`, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

router.post('/from-token', (req, res, next) => {
  const { id, token } = req.body;

  req.app.settings.conn.query(`SELECT * FROM Tokens WHERE userid=${id} AND token='${token}'`, (error, results, fields) => {
    if (error) return res.status(500).json(error);
    if (results.length === 0) {
      return res.status(400).json('Invalid Token');
    }
    // Check expiry date of token
    if (Date.parse(results[0].expiry) < new Date()) {
      return res.status(400).json('Expired Token');
    }
    req.app.settings.conn.query(`SELECT id, email, name, companyName FROM Users WHERE id=${id}`, (error, results, fields) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json(results[0]);
    });
  });
});

router.post('/', (req, res, next) => {
  const { email, password } = req.body;
  
  req.app.settings.conn.query(`SELECT * FROM Users WHERE email='${email}'`, (error, results, fields) => {
    if (error) return res.status(500).json(error);
    bcrypt.compare(password, results[0].password, (err, match) => {
      if (!match) return res.status(400).json('Invalid Email or Password');
      delete results[0].password;
      results['sessiontoken'] = generateToken(results[0].id, req.app.settings.conn);
      return res.json(results[0]);
    });
  });
});


router.post('/new', (req, res, next) => {
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

router.put('/edit', (req, res, next) => {
  const { id, email, name, companyName } = req.body;
  const queryString = `UPDATE Users SET email='${email}', name='${name}', companyName='${companyName}' WHERE id=${id}`;
  req.app.settings.conn.query(queryString, (error, results, fields) => {
    console.log(error);
    if (error) return res.status(400).json(error.sqlMessage);
    return res.status(200).json(req.body);
  });
});

function generateToken(userId, conn) {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  let expiry = new Date();
  expiry = expiry.setFullYear(expiry.getFullYear() + 1);
  const queryString = `INSERT INTO Tokens (token, userid, expiry) VALUES ('${token}', ${userId}, ${expiry}`;
  conn.query(queryString, (error, results, fields) => {
    if (error) return 'error creating token';
    return token;
  });
}

module.exports = router;