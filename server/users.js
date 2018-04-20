/** @module Routes/Users - Routes for authentication flow */

const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");
const router = express.Router();

const app = require("../app");
const { auth:SQL } = require("./statements");
const { isLoggedIn } = require("./mw");
const passwords = fs.readFileSync(`${__dirname}/passwords.txt`, "utf8").split(/\r?\n/);

/**
 * Generate a Session Token
 * @name GenerateToken
 */
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Registers a new user
 * @name newUser
 * @route {POST} /api/users/new
 * @bodyparam {string} email       User input email
 * @bodyparam {string} name        User input name
 * @bodyparam {string} password    User input password
 * @bodyparam {string} companyName User input company name
 */
router.post("/new", (req, res, next) => {
  const { email, name, password, companyName } = req.body;
  const conn = app.get("conn");
  let error = "Insecure Password!";
  if (passwords.indexOf(password) !== -1 || password.length < 8 || !(/\d+/.test(password))) {
    return res.status(401).json(error);
  }

  error = "Error creating user";
  let query = SQL.getUserByEmail(email);
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    if (results.length !== 0) return res.status(401).json(error);

    bcrypt.hash(password, 10, function(err, hash) {
      if (err) return res.status(500).json(error);

      query = SQL.newUser(email, hash, name, companyName);
      conn.query(query, (err, results, fields) => {
        if (err) return res.status(500).json(error);
        const token = generateToken();

        let expiry = moment().add(12, "hours");
        expiry = expiry.format("YYYY-MM-DD HH:MM:ss");
        error = "Error creating token";
        query = SQL.saveToken(token, email, expiry);
        conn.query(query, (err, results, fields) => {
          if (err) {
            return res.status(500).json(error);
          }
          return res.status(200).json("Success");
        });
      });
    });
  });
});

/**
 * Logs in a user with email and password
 * @name login
 * @route {POST} /api/users/login
 * @bodyparam {string} email    User input email
 * @bodyparam {string} password User input password
 */
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  const conn = app.get("conn");
  const success = "Success";
  const userError = "Invalid Email or Password";
  const serverError = "Could not log in (Server Error)";
  let query = SQL.getPassword(email);
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(serverError);
    if (results.length === 0) {
      return res.status(401).json(userError);
    }
    const hash = results[0].password;
    bcrypt.compare(password, hash, (err, match) => {
      if (err) return res.status(500).json(serverError);
      if (!match) {
        return res.status(401).json(userError);
      }
      const token = generateToken();
      query = SQL.saveToken(token, email, moment().format("YYYY-MM-DD HH:MM:ss"));
      conn.query(query, (err, results, fields) => {
        if (err) return res.status(500).json(serverError);
        res.cookie("session", token, { maxAge: 1000 * 60 * 60 * 24 });
        return res.status(200).json(success);
      });
    });
  });
});

/**
 * Logs in a user with from a session cookie
 * @name loginFromCookie
 * @route {POST} /api/users/from-cookie
 */
router.get("/from-cookie", isLoggedIn, (req, res, next) => res.status(200).json("Success"));

router.get("/details", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error retrieving user details";
  const query = SQL.getUserDetails(token);
  conn.query(query, (err, results, fields) => {
    if (err) res.status(500).json(error);
    return res.status(200).json(results[0]);
  });
});

/**
 * Edits an existing user
 * @name editUser
 * @route {PUT} /api/users/edit
 * @bodyparam {string} email       User input email
 * @bodyparam {string} name        User input name
 * @bodyparam {string} companyName User input company name
 */
router.put("/edit", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const { email, name, companyName } = req.body;
  const conn = app.get("conn");
  const error = "Error editing user";
  const query = SQL.editUser(email, name, companyName, token);
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json(req.body);
  });
});

router.get("/signout", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error deleting token";
  const query = SQL.deleteToken(token);
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json("Success");
  });
});

module.exports = router;
