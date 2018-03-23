/** @module Routes/Users - Routes for authentication flow */

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const app = require('../app');

/**
 * Generate a Session Token and save in DB
 * @name GenerateToken
 * @param {number} userId id of logged in user
 * @return Promise, resolves with token on save, else rejects with error.
 */
function generateToken(userId) {
  return new Promise((resolve, reject) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const sqlDate = expiry.toISOString().slice(0, 19).replace('T', ' ');
    const queryString = `INSERT INTO Tokens VALUES ('${token}', ${userId}, '${sqlDate}')`;
    console.log(queryString);
    const conn = app.get('conn');
    conn.query(queryString, (error, results, fields) => {
      console.log(error);
      if (error) reject('Error creating token');
      resolve(token);
    });
  });
}

/**
 * Gets a user from their email
 * @name getUserByEmail
 * @route     {POST} /api/users/email
 * @bodyparam {string} email Email to search for
 */
router.post('/email/:email', (req, res, next) => {
  const conn = app.get('conn');

  conn.query(`SELECT * FROM Users WHERE email='${req.body.email}'`, (error, results, fields) => {
    if (error) return res.status(500).json(error);
    const user = results[0];
    delete user.password;
    return res.status(200).json(results);
  });
});

/**
 * Logs in a user with from a session token
 * @name loginFromToken
 * @route {POST} /api/users/from-token
 * @bodyparam {number} id    User's ID
 * @bodyparam {string} token Session token
 */
router.post('/from-token', (req, res, next) => {
  const { id, token } = req.body;
  const error = 'Error retrieving login data';
  const conn = app.get('conn');

  conn.query(`SELECT * FROM Tokens WHERE userid=${id} AND token='${token}'`, (err, results, fields) => {
    if (err) {
      return res.status(500).json(error);
    }
    if (results.length === 0) {
      return res.status(400).json('Invalid Token');
    }
    // Check expiry date of token
    if (Date.parse(results[0].expiry) < new Date()) {
      return res.status(400).json('Expired Token');
    }
    conn.query(`SELECT id, email, name, companyName FROM Users WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        return res.status(500).json(error);
      }
      return res.status(200).json(results[0]);
    });
  });
});

/**
 * Logs in a user with email and password
 * @name loginStandard
 * @route {POST} /api/users/
 * @bodyparam {string} email    User input email
 * @bodyparam {string} password User input password
 */
router.post('/', (req, res, next) => {
  const { email, password } = req.body;
  const conn = app.get('conn');

  conn.query(`SELECT * FROM Users WHERE email='${email}'`, (error, results, fields) => {
    if (error) return res.status(500).json('Invalid Email or Password');
    let user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json(error);
      if (!match) return res.status(400).json('Invalid Email or Password');
      delete user.password;
      generateToken(user.id)
        .then(token => {
          user.token = token;
          return res.json(user);
        })
        .catch(error => {
          return res.status(500).json(error);
        });
    });
  });
});

/**
 * Registers a new user
 * @name newUser
 * @route {POST} /api/users/new
 * @bodyparam {string} email       User input email
 * @bodyparam {string} name        User input name
 * @bodyparam {string} password    User input password
 * @bodyparam {string} companyName User input company name
 */
router.post('/new', (req, res, next) => {
  const { email, name, password, companyName } = req.body;
  const error = 'Error saving user';
  const conn = app.get('conn');

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) return res.status(500).json(error);

    let queryString = `SELECT * FROM Users WHERE email='${email}'`;

    conn.query(queryString, (err, results, fields) => {
      if (err) return res.status(500).json(error);
      if (results.length !== 0) return res.status(400).json('A user with that email already exists');
      queryString = `INSERT INTO Users (email, password, name, companyName)
                      VALUES ('${email}','${hash}','${name}','${companyName}')`;

      conn.query(queryString, (err, results, fields) => {
        if (err) return res.status(500).json(error);
        res.json({ id: results.insertId, name, email, companyName });
      });
    });
  });
});

/**
 * Edits an existing user
 * @name editUser
 * @route {PUT} /api/users/edit
 * @bodyparam {number} id          User ID
 * @bodyparam {string} email       User input email
 * @bodyparam {string} name        User input name
 * @bodyparam {string} companyName User input company name
 */
router.put('/edit', (req, res, next) => {
  const { id, email, name, companyName } = req.body;
  const conn = app.get('conn');
  const queryString = `UPDATE Users SET email='${email}', name='${name}', companyName='${companyName}' WHERE id=${id}`;

  conn.query(queryString, (error, results, fields) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(req.body);
  });
});

module.exports = router;
