const pool = require('../config/db');

async function purchaseProduct(userId, productId) {
  const query = `
    INSERT INTO purchases (user_id, product_id)
    VALUES ($1, $2)
    RETURNING purchase_id, user_id, product_id
  `;

  const values = [userId, productId];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = {
  purchaseProduct,
};
