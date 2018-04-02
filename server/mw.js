/** @module Middleware */
const app = require("../app");
const { auth:SQL } = require("./statements");

const isLoggedIn = (req, res, next) => {
  const conn = app.get("conn");
  const serverError = "Error checking token";
  const userError = "User not authorized";
  const query = SQL.getUserFromToken(req.cookies.session);
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(serverError);
    if (results.length === 0) return res.status(401).json(userError);
    next();
  });
};

module.exports = {
  isLoggedIn
};
