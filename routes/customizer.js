const express = require('express');
const router = express.Router();

router.get('/variables', function(req, res, next) {
  req.app.settings.conn.query('SELECT * FROM Variables', (error, results, fields) => {
    if (error) return res.status(500).json(error);
    console.log(res.json(results));
  });
});

module.exports = router;