/** @module PreparedStatements */
const mysql = require("mysql");
const userId = "(SELECT userId FROM Tokens WHERE token=? AND type='session');";

function newUser(email, password, name, companyName) {
  const query = "INSERT INTO Users (email, password, name, companyName) VALUES (?, ?, ?, ?);";
  return mysql.format(query, Object.values(arguments));
}

function getUserByEmail(email) {
  const query = "SELECT * FROM Users WHERE email=?;";
  return mysql.format(query, Object.values(arguments));
}

function saveSessionToken(token, email, expiry) {
  const query = "INSERT INTO Tokens (token, userId, expiry, type)" +
                " VALUES (?, (SELECT id FROM Users WHERE email=?), ?, 'session');";
  return mysql.format(query, Object.values(arguments));
}

function saveVerifyToken(token, email, expiry) {
  const query = "INSERT INTO Tokens (token, userId, expiry, type)" +
                " VALUES (?, (SELECT id FROM Users WHERE email=?), ?, 'verify');";
  return mysql.format(query, Object.values(arguments));
}

function saveResetToken(token, email, expiry) {
  const query = "INSERT INTO Tokens (token, userId, expiry, type)" +
                " VALUES (?, (SELECT id FROM Users WHERE email=?), ?, 'reset');";
  return mysql.format(query, Object.values(arguments));
}

function verifyUser(userId) {
  const query = "UPDATE Users SET isVerified=1 WHERE id=?";
  return mysql.format(query, Object.values(arguments));
}

function getPassword(email) {
  const query = "SELECT password FROM Users WHERE email=?;";
  return mysql.format(query, [email]);
}

function setPassword(password, token) {
  const query = "UPDATE Users SET password=? WHERE id=(SELECT userId FROM Tokens WHERE token=? AND type='reset');";
  return mysql.format(query, Object.values(arguments));
}

function getToken(token) {
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

function getPresets() {
  return "SELECT id, name, description, volume, colour, hoppiness, maltFlavour, imageType, customImage" +
         " FROM Customizations WHERE userId=1";
}

function editVariable(name, min, max, step, defaultVal, suffix, id) {
  const query = "UPDATE Variables SET name=?, min=?, max=?, step=?, defaultVal=?, suffix=? WHERE id=?;";
  return mysql.format(query, Object.values(arguments));
}

function getCustomizations(token) {
  const query = "SELECT id, name, description, volume, colour, hoppiness, maltFlavour, imageType, customImage" +
                " FROM Customizations WHERE userId=" + userId;
  return mysql.format(query, [token]);
}

function newCustomization(token, name, description, volume, colour, hoppiness, maltFlavour) {
  const query = "INSERT INTO Customizations (userId, name, description, volume, colour, hoppiness, maltFlavour)" +
  " VALUES ((SELECT userId FROM Tokens WHERE token=?), ?, ?, ?, ?, ? ,?);";
  return mysql.format(query, Object.values(arguments));
}

function updateCustomization(description, volume, colour, hoppiness, maltFlavour, name, token) {
  const query = "UPDATE Customizations SET description=?, volume=?, colour=?, hoppiness=?, maltFlavour=?" +
  " WHERE name=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function editCustomizationDetails(name, description, id, token) {
  const query = "UPDATE Customizations SET name=?, description=? WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function editCustomizationImage(imageType, customImage, id, token) {
  const query = "UPDATE Customizations SET imageType=?, customImage=? WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function deleteCustomization(id, token) {
  const query = "DELETE FROM Customizations WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getCustomizationById(id, token) {
  const query = "SELECT id, name, description, volume, colour, hoppiness, maltFlavour, imageType, customImage" +
  " FROM Customizations WHERE id=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getCustomizationByNameAndUser(name, token) {
  const query = "SELECT id FROM Customizations WHERE name=? AND userId=" + userId;
  return mysql.format(query, Object.values(arguments));
}

function getProductsByCategory(token, category) {
  const query = "SELECT id, name, description, price, category, quantity" +
                " FROM Products LEFT JOIN Baskets" +
                " ON Baskets.productId=Products.id AND Baskets.userId=(SELECT userId FROM Tokens WHERE token=?)" +
                " WHERE category=? GROUP BY Products.id";
  return mysql.format(query, Object.values(arguments));
}

function addProductToBasket(productId, token, quantity) {
  const query = "INSERT INTO Baskets (productId, userId, quantity) VALUES" +
                " (?, (SELECT userId FROM Tokens WHERE token=?), ?)" +
                " ON DUPLICATE KEY UPDATE quantity=quantity+?;";
  return mysql.format(query, [productId, token, quantity, quantity]);
}

function addCustomizationToBasket(productId, token, quantity, customizationId) {
  const query = "INSERT INTO Baskets (productId, userId, quantity, customizationId) VALUES" +
                " (?, (SELECT userId FROM Tokens WHERE token=?), ?, ?);";
  return mysql.format(query, Object.values(arguments));
}

function getBasketSize(token) {
  const query = "SELECT COUNT(*) FROM Baskets WHERE userId=" + userId;
  return mysql.format(query, [token]);
}

function getBasketItems(token) {
  const query = "SELECT ProductId AS id, quantity, Products.name, price, category," +
                " CASE WHEN ProductID!=1 THEN Products.name ELSE Customizations.name END AS name," +
                " CASE WHEN ProductID!=1 THEN Products.description ELSE Customizations.description END AS description" +
                " FROM Baskets INNER JOIN Products ON Products.id=Baskets.productId" +
                " LEFT JOIN Customizations ON baskets.customizationId=Customizations.id" +
                " WHERE Baskets.userId=" + userId;
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
    saveSessionToken,
    saveVerifyToken,
    saveResetToken,
    getPassword,
    setPassword,
    getToken,
    verifyUser,
    getUserDetails,
    editUser,
    deleteToken
  },
  customizer: {
    getVariables,
    getPresets,
    editVariable,
    getCustomizations,
    newCustomization,
    updateCustomization,
    editCustomizationDetails,
    editCustomizationImage,
    deleteCustomization,
    getCustomizationById,
    getCustomizationByNameAndUser
  },
  shop: {
    getProductsByCategory,
    addProductToBasket,
    addCustomizationToBasket,
    getBasketSize,
    getBasketItems,
    updateQuantity
  }
};
