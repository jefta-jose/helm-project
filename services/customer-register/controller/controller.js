const express = require('express');
const registerService = require('../service/service');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerService.registerUser(email, password);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
