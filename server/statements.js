/** @module PreparedStatements */
const mysql = require('mysql');

function editVariables(name, min, max, step, defaultVal, suffix, id) {
  const query = 'UPDATE Variables SET name=?, min=?, max=?, step=?, defaultVal=?, suffix=? WHERE id=?;';
  return mysql.format(query, Object.values(arguments));
}

function getProductsByCategory(category) {
  const query = 'SELECT * FROM Products WHERE category=?;';
  return mysql.format(query, [category]);
}

function addProductToBasket(productId, userId, quantity) {
  const query = 'INSERT INTO Baskets (productId, userId, quantity) VALUES (?, ?, ?)' +
                'ON DUPLICATE KEY UPDATE quantity = quantity + ?';
  return mysql.format(query, [productId, userId, quantity, quantity]);
}

module.exports = {
  editVariables,
  getProductsByCategory,
  addProductToBasket
};
