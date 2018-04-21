/** @module Shop */
const express = require("express");
const router = express.Router();
const app = require("../app");

const { shop:SQL } = require("./statements");
const { isLoggedIn } = require("./mw");
const logger = require("../logger");

/**
 * Get a list of products of a certain category
 * @name getProductsByCategory
 * @route       {GET}   /api/shop/products/category
 * @routeparam {string} category Name of the category to search for
 */
router.get("/products/category/:category", (req, res, next) => {
  const category = req.params.category;
  let error = "Error retrieving products";
  const conn = app.get("conn");
  const query = SQL.getProductsByCategory(category);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err);
      return res.status(500).json(error);
    }
    error = "Invalid category";
    if (results.length === 0) return res.status(400).json(error);
    return res.status(200).json(results);
  });
});

/**
 * Adds an item to a user's basket, or updates the quantity if it is already in the basket
 * @name addProductToBasket
 * @route       {POST} /api/shop/basket/add
 * @bodyparam {number} productId Product to be added
 * @bodyparam {number} quantity  Quantity of item to add
 */
router.post("/basket/add", isLoggedIn, (req, res, next) => {
  const { productId, quantity } = req.body;
  const token = req.cookies.session;
  let error = "Error adding item to basket";
  const conn = app.get("conn");
  const query = SQL.addProductToBasket(productId, token, quantity);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err);
      return res.status(500).json(error);
    }
    const query = SQL.getBasketSize(token);
    error = "Error getting updated basket";
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err);
        return res.status(500).json(error);
      }
      return res.status(200).json(results[0]["COUNT(*)"]);
    });
  });
});

/**
 * Gets the size of a user's basket
 * @name getBasketSize
 * @route {GET} /api/shop/basket/size
*/
router.get("/basket/size", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const error = "Error getting basket size";
  const conn = app.get("conn");
  const query = SQL.getBasketSize(token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err);
      return res.status(500).json(error);
    }
    return res.status(200).json(results[0]["COUNT(*)"]);
  });
});

function getBasket(token) {
  return new Promise((resolve, reject) => {
    const error = "Error getting basket";
    const conn = app.get("conn");
    const query = SQL.getBasketItems(token);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err);
        reject(error);
      }
      resolve(results);
    });
  });
}

/**
 * Gets the contents of a user's basket
 * @name getBasket
 * @route {GET} /api/shop/basket/get
*/
router.get("/basket/get", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  getBasket(token)
    .then(results => res.status(200).json(results))
    .catch(error => res.status(500).json(error));
});

/**
 * Updates the quantity of an item in a user's basket
 * @name updateQuantity
 * @route       {PUT}   /api/shop/basket/update
 * @routeparam {number} quantity  Updated quantity
 * @routeparam {number} productId ID of product to update
*/
router.put("/basket/update", isLoggedIn, (req, res, next) => {
  const { quantity, productId } = req.body;
  const token = req.cookies.session;
  const error = "Error updating basket";
  const conn = app.get("conn");
  const query = SQL.updateQuantity(quantity, productId, token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err);
      return res.status(500).json(error);
    }
    getBasket(token)
      .then(results => res.status(200).json(results))
      .catch(error => res.status(500).json(error));
  });
});

module.exports = router;
