const express = require('express');
const router = express.Router();

const app = require('../app');

const { editVariable } = require('./statements');

router.get('/variables', (req, res, next) => {
  const conn = app.get('conn');
  conn.query('SELECT * FROM Variables', (error, results, fields) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

router.put('/variables', (req, res, next) => {
  const { id, name, min, max, step, defaultVal, suffix } = req.body;
  const query = editVariable(name, min, max, step, defaultVal, suffix, id);
  const conn = app.get('conn');

  conn.query(query, (error, results, fields) => {
    if (error) return res.status(400).json(error.sqlMessage);
    return res.status(200).json(results);
  });
});

router.get('/id/:id', (req, res, next) => {
  return res.status(200).json({ id: Number(req.params.id), name: 'Test Beer', abv: 4.5 });
});

module.exports = router;
