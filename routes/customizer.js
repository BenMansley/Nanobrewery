const express = require('express');
const router = express.Router();

const app = require('../app');
const conn = app.get('conn');

router.get('/variables', (req, res, next) => {
  conn.query('SELECT * FROM Variables', (error, results, fields) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

router.put('/variables', (req, res, next) => {
  const { id, name, min, max, step, defaultVal, suffix } = req.body;
  const queryString = 
    `UPDATE Variables SET name='${name}', min=${min}, max=${max}, step=${step}, defaultVal=${defaultVal}, suffix='${suffix}' WHERE id=${id}`;
  conn.query(queryString, (error, results, fields) => {
    if (error) return res.status(400).json(error.sqlMessage);
    return res.status(200).json(results);
  });
});

router.get('/id/:id', (req, res, next) => {
  return res.status(200).json({ id: Number(req.params.id), name: 'Test Beer', abv: 4.5 });
})

module.exports = router;