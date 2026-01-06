require('dotenv').config();

const express = require('express');
const registerController = require('./controller/controller');

const app = express();
app.use(express.json());

app.use('/register', registerController);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Register service is running on port ${PORT}`);
});