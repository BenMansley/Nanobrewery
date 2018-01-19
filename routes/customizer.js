const express = require('express');
const router = express.Router();

router.get('/variables', function(req, res, next) {
  req.app.settings.conn.query('SELECT * FROM Variables', (error, results, fields) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(results);
  });
});

router.post('/variables', function(req, res, next) {
  console.log(req.body);
  const { id, name, min, max, step, defaultVal, suffix } = req.body;
  const queryString = 
    `UPDATE Variables SET name='${name}', min=${min}, max=${max}, step=${step}, defaultVal=${defaultVal}, suffix='${suffix}' WHERE id=${id}`;
  console.log(queryString);
  req.app.settings.conn.query(queryString, (error, results, fields) => {
    if (error) return res.status(400).json(error);
    console.log(results);
    return res.status(200).json(results);
  });
})

module.exports = router;