const pool = require('../config/db');

async function registerUser(email, password) {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING user_id, email
  `;

  const values = [email, password];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = {
  registerUser,
};
