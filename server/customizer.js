/** @module Customizer */
const path = require("path");
const { readFileSync } = require("fs");
const express = require("express");
const router = express.Router();
const app = require("../app");

const { customizer:SQL } = require("./statements");
const { isLoggedIn } = require("./mw");

/**
 * Gets all customizer variables
 * @name getVariables
 * @route {GET} /api/customizer/variables
 */
router.get("/variables", (req, res, next) => {
  const conn = app.get("conn");
  const error = "Error retrieving customization options";
  const query = SQL.getVariables();
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

/**
 * Gets all data (variables and description template strings)
 * @name getAllData
 * @route {GET} /api/customizer/all-data
 */
router.get("/all-data", (req, res, next) => {
  const conn = app.get("conn");
  const error = "Error getting data";
  let data = { variables: [], templates: [] };

  const query = SQL.getVariables();
  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    data.variables = results;
    const filename = path.join(__dirname, "../raw/strings.json");
    data.templates = JSON.parse(readFileSync(filename, "utf-8"));
    return res.status(200).json(data);
  });
});

/**
 * Updates a customizer variable (ADMIN)
 * @name editVariable
 * @route       {PUT}   /api/customizer/edit-variable
 * @routeparam {number} id         ID of variable to edit
 * @routeparam {string} name       Updated variable name
 * @routeparam {number} min        Updated minimum value
 * @routeparam {number} max        Updated maximum value
 * @routeparam {number} step       Updated step (increment)
 * @routeparam {number} defaultVal Updated default value
 * @routeparam {string} suffix     Updated suffix
 */
router.put("/edit-variable", (req, res, next) => {
  const { id, name, min, max, step, defaultVal, suffix } = req.body;
  const conn = app.get("conn");
  const error = "Error updating variables";
  const query = SQL.editVariable(name, min, max, step, defaultVal, suffix, id);

  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json("Success");
  });
});

/**
 * Gets all customizations from a given user
 * @name getCustomizations
 * @route       {POST} /api/customizer/customizations
 */
router.get("/customizations", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error retrieving customizations";
  const query = SQL.getCustomizations(token);

  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

/**
 * Gets basic info about customizations from a given user
 * @name getBasicCustomizations
 * @route       {POST} /api/customizer/customizations
 */
router.get("/customizations-basic", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error retrieving customizations";
  const query = SQL.getCustomizationsBasic(token);

  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

/**
 * Creates a new customization
 * @name newCustomization
 * @route       {POST} /api/customizer/new
 * @bodyparam {number} name        Name of the new customization
 * @bodyparam {number} description Description of the new customization
 * @bodyparam {number} volume      Volume of the new customization
 * @bodyparam {number} colour      Colour of the new customization
 * @bodyparam {number} hoppiness   Hoppiness of the new customization
 * @bodyparam {number} maltFlavour MaltFlavour of the new customization
 */
router.post("/new", isLoggedIn, (req, res, next) => {
  const { name, description, volume, colour, hoppiness, maltFlavour } = req.body;
  const token = req.cookies.session;
  const conn = app.get("conn");
  let error = "Your beer needs a name!";
  if (!name) return res.status(500).json(error);
  error = "Error saving new customization";
  const query = SQL.newCustomization(token, name, description, volume, colour, hoppiness, maltFlavour);

  conn.query(query, (err, results, fields) => {
    if (err) return res.status(500).json(error);
    return res.status(200).json(results.insertId);
  });
});

/**
 * Gets a user's customization from its id
 * @name getCustomizationById
 * @route       {GET}   /api/customizer/from-id
 * @routeparam {number} id ID of the customization to get
 */
router.get("/from-id/:id", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const id = req.params.id;
  const conn = app.get("conn");
  const error = "Could not get customization";
  const query = SQL.getCustomizationById(id, token);
  conn.query(query, (err, results, fields) => {
    if (err || results.length === 0) return res.status(500).json(error);
    return res.status(200).json(results[0]);
  });
});

module.exports = router;
