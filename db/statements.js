/** @module PreparedStatements */
const mysql = require('mysql');

function editVariables(name, min, max, step, defaultVal, suffix, id) {
  const query = `UPDATE Variables SET name=?, min=?, max=?, step=?, defaultVal=?, suffix=? WHERE id=?;`;
  return mysql.format(query, Object.values(arguments));
}

module.exports = {
  editVariables
};
