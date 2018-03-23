/** @module Shop */
const express = require('express');
const router = express.Router();
const app = require('../app');

const { getProductsByCategory } = require('./statements');

router.get('/products/category/:category', (req, res, next) => {
  const category = req.params.category;
  const error = 'Error retrieving products';
  const conn = app.get('conn');
  const query = getProductsByCategory(category);
  conn.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(500).json(error);
    }
    return res.status(200).json(results);
  });
});

module.exports = router;
