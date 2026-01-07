const express = require('express');
const registerService = require('../service/service');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const user = await registerService.purchaseProduct(user_id, product_id);

    res.status(201).json({
      message: 'Product purchased successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
