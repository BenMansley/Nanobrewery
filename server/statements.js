/** @module PreparedStatements */
const mysql = require("mysql");
const userId = "(SELECT userId FROM Tokens WHERE token=?);";

function newUser(email, password, name, companyName) {
  const query = "INSERT INTO Users (email, password, name, companyName) VALUES (?, ?, ?, ?);";
  return mysql.format(query, Object.values(arguments));
}

function getUserByEmail(email) {
  const query = "SELECT * FROM Users WHERE email=?;";
  return mysql.format(query, [email]);
}

function saveToken(token, email, expiry) {
  const query = "INSERT INTO Tokens (token, userId, expiry)" +
                " VALUES (?, (SELECT id FROM Users WHERE email=?), ?);";
  return mysql.format(query, Object.values(arguments));
}

function getPassword(email) {
  const query = "SELECT password FROM Users WHERE email=?;";
  return mysql.format(query, [email]);
}

function getUserFromToken(token) {
  const query = "SELECT * FROM Tokens WHERE token=?;";
  return mysql.format(query, [token]);
}

function getUserDetails(token) {
  const query = "SELECT name, email, companyName FROM Users WHERE id=" + userId;
  return mysql.format(query, [token]);
}

function editUser(email, name, companyName, token) {
  const query = "UPDATE Users SET email=?, name=?, companyName=? WHERE id=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function deleteToken(token) {
  const query = "DELETE FROM Tokens WHERE Token=?;";
  return mysql.format(query, [token]);
}

function getVariables() {
  return "SELECT * FROM Variables WHERE id<5;";
}

function editVariable(name, min, max, step, defaultVal, suffix, id) {
  const query = "UPDATE Variables SET name=?, min=?, max=?, step=?, defaultVal=?, suffix=? WHERE id=?;";
  return mysql.format(query, Object.values(arguments));
}

function getCustomizations(token) {
  const query = "SELECT id, name, description, volume, colour, hoppiness, maltFlavour" +
                " FROM Customizations WHERE userId=" + userId;
  return mysql.format(query, [token]);
}

function newCustomization(token, name, description, volume, colour, hoppiness, maltFlavour) {
  const query = "INSERT INTO Customizations (userId, name, description, volume, colour, hoppiness, maltFlavour)" +
  " VALUES ((SELECT userId FROM Tokens WHERE token=?), ?, ?, ?, ?, ? ,?);";
  return mysql.format(query, Object.values(arguments));
}

function updateCustomization(name, description, volume, colour, hoppiness, maltFlavour, id) {
  const query = "UPDATE Customizations SET name=?, description=?, volume=?, colour=?, hoppiness=?, maltFlavour=?" +
  " WHERE id=?";
  return mysql.format(query, Object.values(arguments));
}

function deleteCustomization(id, token) {
  const query = "DELETE FROM Customizations WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getCustomizationById(id, token) {
  const query = "SELECT id, name, description, volume, colour, hoppiness, maltFlavour" +
  " FROM Customizations WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getCustomizationByNameAndUser(name, token) {
  const query = "SELECT id FROM Customizations WHERE name=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getProductsByCategory(category) {
  const query = "SELECT id, name, description, price, category, quantity" +
                " FROM Products LEFT JOIN Baskets ON Baskets.productId=Products.id " +
                " WHERE category=? GROUP BY Products.id;";
  return mysql.format(query, [category]);
}

function addProductToBasket(productId, token, quantity) {
  const query = "INSERT INTO Baskets (productId, userId, quantity) VALUES" +
                " (?, (SELECT userId FROM Tokens WHERE token=?), ?)" +
                " ON DUPLICATE KEY UPDATE quantity=quantity+?;";
  return mysql.format(query, [productId, token, quantity, quantity]);
}

function getBasketSize(token) {
  const query = "SELECT COUNT(*) FROM Baskets WHERE userId=" + userId;
  return mysql.format(query, [token]);
}

function getBasketItems(token) {
  const query = "SELECT ProductId AS id, quantity, name, description, price, category" +
                " FROM Baskets INNER JOIN Products" +
                " WHERE Products.id=baskets.productId AND userId=" + userId;
  return mysql.format(query, [token]);
}

function updateQuantity(quantity, productId, token) {
  const query = "UPDATE Baskets SET quantity=? WHERE productId=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

module.exports = {
  auth: {
    newUser,
    getUserByEmail,
    saveToken,
    getPassword,
    getUserFromToken,
    getUserDetails,
    editUser,
    deleteToken
  },
  customizer: {
    getVariables,
    editVariable,
    getCustomizations,
    newCustomization,
    updateCustomization,
    deleteCustomization,
    getCustomizationById,
    getCustomizationByNameAndUser
  },
  shop: {
    getProductsByCategory,
    addProductToBasket,
    getBasketSize,
    getBasketItems,
    updateQuantity
  }
};
