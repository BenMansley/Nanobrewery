/** @module Routes/Users - Routes for authentication flow */

const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");
const router = express.Router();

const app = require("../app");
const { auth:SQL } = require("./statements");
const { isLoggedIn } = require("./mw");
const logger = require("../logger");
const mailer = require("./mailer");
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
 * @bodyparam {string} password    User input date of birth
 * @bodyparam {string} companyName User input company name
 */
router.post("/new", (req, res, next) => {
  const { email, name, password, dob, companyName } = req.body;
  const conn = app.get("conn");
  let error = "Insecure Password!";
  if (passwords.indexOf(password) !== -1 || password.length < 10) {
    return res.status(401).json(error);
  }

  error = "You must be at least 18 to sign up";
  const isUnderage = moment().subtract(18, "years").isSameOrBefore(dob);
  if (isUnderage) {
    return res.status(401).json(error);
  }

  error = "Error creating user";
  let query = SQL.getUserByEmail(email);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }
    if (results.length !== 0) {
      return res.status(401).json(error);
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(error);
      }

      query = SQL.newUser(email, hash, name, companyName);
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err.message);
          return res.status(500).json(error);
        }

        const token = generateToken();
        let expiry = moment().add(12, "hours").toDate();
        error = "Error creating token";
        query = SQL.saveVerifyToken(token, email, expiry);
        conn.query(query, (err, results) => {
          if (err) {
            logger.error(err.message);
            return res.status(500).json(error);
          }

          //     error = "Error sending verification email";
          //     mailer.verify(name, email, token)
          //       .then(_ => {
          //         return res.status(200).json("Success");
          //       })
          //       .catch(err => {
          //         logger.error(err);
          //         return res.status(500).json(error);
          //       });
          //   });
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
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(serverError);
    }
    if (results.length === 0) {
      return res.status(401).json(userError);
    }
    const hash = results[0].password;
    bcrypt.compare(password, hash, (err, match) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(serverError);
      }
      if (!match) {
        return res.status(401).json(userError);
      }
      const token = generateToken();
      query = SQL.saveSessionToken(token, email, moment().add(12, "hours").toDate());
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err.message);
          return res.status(500).json(serverError);
        }
        res.cookie("session", token, { maxAge: 1000 * 60 * 60 * 12 });
        return res.status(200).json(success);
      });
    });
  });
});

router.get("/reverify", (req, res, next) => {
  const token = req.params.t;
  const conn = app.get("conn");
  let error = "Error retrieving token";
  let query = SQL.getUserDetails(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }
    if (results.length === 0) return res.status(401).json(error);

    const email = results[0].email;
    const token = generateToken();
    let expiry = moment().add(12, "hours").toDate();
    error = "Error creating token";
    query = SQL.saveEmailToken(token, email, expiry);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(error);
      }

      error = "Error sending verification email";
      mailer.verify(name, email, token)
        .then(_ => {
          return res.status(200).json("Success");
        })
        .catch(err => {
          logger.error(err.message);
          return res.status(500).json(error);
        });
    });
  });
});

router.get("/verify", (req, res, next) => {
  const token = req.query.t;
  const conn = app.get("conn");
  let error = "Error retrieving token";
  let query = SQL.getToken(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }

    error = "Token Not Found";
    if (results.length === 0) return res.status(401).json(error);

    const { userId, expiry } = results[0];
    error = "Token Expired";
    if (new Date(expiry) < new Date()) return res.status(401).json(error);

    error = "Error verifying user";
    query = SQL.verifyUser(userId);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(error);
      }

      error = "Error deleting token";
      query = SQL.deleteToken(token);
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err.message);
          return res.status(500).json(error);
        }
        return res.status(200).json("Success");
      });
    });
  });
});

router.post("/reset", (req, res, next) => {
  const password = req.body.password;
  let error = "Insecure Password!";
  if (passwords.indexOf(password) !== -1 || password.length < 8) {
    return res.status(401).json(error);
  }

  const token = req.query.t;
  const conn = app.get("conn");
  error = "Error getting token";
  let query = SQL.getToken(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }

    error = "Token Not Found";
    if (results.length === 0) return res.status(401).json(error);

    const expiry = results[0].expiry;
    error = "Token Expired";
    if (new Date(expiry) < new Date()) return res.status(401).json(error);

    error = "Error hashing password";
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(error);
      }

      error = "Error resetting password";
      query = SQL.setPassword(hash, token);
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err.message);
          return res.status(500).json(error);
        }

        error = "Error deleting token";
        query = SQL.deleteToken(token);
        conn.query(query, (err, results) => {
          if (err) {
            logger.error(err.message);
            return res.status(500).json(error);
          }
          return res.status(200).json("Success");
        });
      });
    });
  });
});

router.post("/send-reset", (req, res, next) => {
  const email = req.body.email;
  const conn = app.get("conn");
  let error = "Error getting user";
  let query = SQL.getUserByEmail(email);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }

    const exists = results.length !== 0;
    const name = exists ? results[0].name : "";

    const token = generateToken();
    const expiry = moment().add(12, "hours").toDate();
    const tokenEmail = exists ? email : "emailfail@nanobrewery.com";
    error = "Error saving token";
    query = SQL.saveResetToken(token, tokenEmail, expiry);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.message);
        return res.status(500).json(error);
      }

      error = "Error sending verification email";
      mailer.reset(name, email, exists, token)
        .then(_ => {
          return res.status(200).json("Success");
        })
        .catch(err => {
          logger.error(err.message);
          return res.status(500).json(error);
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
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }
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
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }
    return res.status(200).json(req.body);
  });
});

router.get("/signout", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error deleting token";
  const query = SQL.deleteToken(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json(error);
    }
    return res.status(200).json("Success");
  });
});

module.exports = router;
