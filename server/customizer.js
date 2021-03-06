/** @module Customizer */
const path = require("path");
const { readFileSync } = require("fs");
const express = require("express");
const router = express.Router();
const app = require("../app");

const { customizer:SQL } = require("./statements");
const { isLoggedIn } = require("./mw");
const logger = require("../logger");

/**
 * Gets all customizer variables
 * @name getVariables
 * @route {GET} /api/customizer/variables
 */
router.get("/variables", (req, res, next) => {
  const conn = app.get("conn");
  const error = "Error retrieving customization options";
  const query = SQL.getVariables();
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }
    return res.status(200).json(results);
  });
});

/**
 * Gets all data (variables, presets and description template strings)
 * @name getAllData
 * @route {GET} /api/customizer/all-data
 */
router.get("/all-data", (req, res, next) => {
  const conn = app.get("conn");
  const error = "Error getting data";
  let data = { variables: [], presets: [], templates: [] };

  let query = SQL.getVariables();
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }
    data.variables = results;

    query = SQL.getPresets();
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      data.presets = results;

      const filename = path.join(__dirname, "../raw/strings.json");
      data.templates = JSON.parse(readFileSync(filename, "utf-8"));
      return res.status(200).json(data);
    });
  });
});

/**
 * Updates a customizer variable (ADMIN)
 * @name editVariable
 * @route      {PUT}   /api/customizer/edit-variable
 * @bodyparam {number} id         ID of variable to edit
 * @bodyparam {string} name       Updated variable name
 * @bodyparam {number} min        Updated minimum value
 * @bodyparam {number} max        Updated maximum value
 * @bodyparam {number} step       Updated step (increment)
 * @bodyparam {number} defaultVal Updated default value
 * @bodyparam {string} suffix     Updated suffix
 */
router.put("/edit-variable", (req, res, next) => {
  const { id, name, min, max, step, defaultVal, suffix } = req.body;
  const conn = app.get("conn");
  const error = "Error updating variables";
  const query = SQL.editVariable(name, min, max, step, defaultVal, suffix, id);

  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }
    return res.status(200).json("Success");
  });
});

/**
 * Gets all customizations from a given user
 * @name getCustomizations
 * @route {POST} /api/customizer/customizations
 */
router.get("/customizations", isLoggedIn, (req, res, next) => {
  const token = req.cookies.session;
  const conn = app.get("conn");
  const error = "Error getting customizations";
  const query = SQL.getCustomizations(token);

  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }
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
  if (!name) return res.status(400).json(error);

  error = "Error retrieving customizations";
  let query = SQL.getCustomizationByNameAndUser(name, token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }

    error = "You already have a beer with that name!";
    if (results.length !== 0) return res.status(400).json(error);

    error = "Error saving new customization";
    query = SQL.newCustomization(token, name, description, volume, colour, hoppiness, maltFlavour);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      const id = results.insertId;

      error = "Error retrieving customizations";
      query = SQL.getCustomizations(token);
      conn.query(query, (err, results) => {
        if (err) {
          logger.error(err.sqlMessage);
          return res.status(500).json(error);
        }
        return res.status(200).json({ customizations: results, id });
      });
    });
  });
});

router.put("/update", isLoggedIn, (req, res, next) => {
  const { name, description, volume, colour, hoppiness, maltFlavour } = req.body;
  const token = req.cookies.session;
  const conn = app.get("conn");
  let error = "Your beer needs a name!";
  if (!name) return res.status(400).json(error);

  error = "Error updating customization";
  let query = SQL.updateCustomization(description, volume, colour, hoppiness, maltFlavour, name, token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }

    error = "No beer found with that name!";
    if (results.affectedRows === 0) {
      return res.status(400).json(error);
    }

    error = "Error retrieving customizations";
    query = SQL.getCustomizations(token);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      const id = results.find(c => c.name === name).id;
      return res.status(200).json({ customizations: results, id });
    });
  });
});

router.put("/edit-details", isLoggedIn, (req, res, next) => {
  const { name, description, id } = req.body;
  const token = req.cookies.session;
  const conn = app.get("conn");
  let error = "Your beer needs a name!";
  if (!name) return res.status(400).json(error);

  error = "Error updating customization";
  let query = SQL.editCustomizationDetails(name, description, id, token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }

    error = "No beer found with that id!";
    if (results.affectedRows === 0) {
      return res.status(400).json(error);
    }

    error = "Error retrieving customizations";
    query = SQL.getCustomizations(token);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      return res.status(200).json(results);
    });
  });
});

router.put("/edit-image", isLoggedIn, (req, res, next) => {
  const { imageType, customImage, id } = req.body;
  const token = req.cookies.session;
  const conn = app.get("conn");
  let error = "Error updating customization";
  let query = SQL.editCustomizationImage(imageType, customImage, id, token);
  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }

    error = "No beer found with that id!";
    if (results.affectedRows === 0) {
      return res.status(400).json(error);
    }

    error = "Error retrieving customizations";
    query = SQL.getCustomizations(token);
    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      return res.status(200).json(results);
    });
  });
});

/**
 * Deletes a customization
 * @name deleteCustomization
 * @route     {DELETE} /api/customizer/delete
 * @bodyparam {number} id ID of customization to delete
*/
router.delete("/delete", isLoggedIn, (req, res, next) => {
  const id = req.body.id;
  const token = req.cookies.session;
  const conn = app.get("conn");
  let error = "Error deleting customization";
  let query = SQL.deleteCustomization(id, token);

  conn.query(query, (err, results) => {
    if (err) {
      logger.error(err.sqlMessage);
      return res.status(500).json(error);
    }

    error = "No beer found with that id!";
    if (results.affectedRows === 0) {
      return res.status(400).json(error);
    }

    error = "Error getting customizations";
    query = SQL.getCustomizations(token);

    conn.query(query, (err, results) => {
      if (err) {
        logger.error(err.sqlMessage);
        return res.status(500).json(error);
      }
      return res.status(200).json(results);
    });
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
  const error = "Error getting customization";
  const query = SQL.getCustomizationById(id, token);
  conn.query(query, (err, results) => {
    if (err || results.length === 0) return res.status(500).json(error);
    return res.status(200).json(results[0]);
  });
});

module.exports = router;
