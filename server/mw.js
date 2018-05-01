/** @module Middleware */
const app = require("../app");
const logger = require("../logger");
const { auth:SQL } = require("./statements");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  let serverError = "Error checking token";
  const userError = "User not authorized";
  let query = SQL.getToken(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err);
      return res.status(500).json(serverError);
    }
    if (results.length === 0) return res.status(401).json(userError);
    if (new Date(results[0].expiry) < new Date()) {
      query = SQL.deleteToken(token);
      serverError = "Error deleting token";
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err);
          return res.status(500).json(serverError);
        }
        return res.status(401).json(userError);
      });
    } else {
      next();
    }
  });
};

module.exports = {
  isLoggedIn
};
