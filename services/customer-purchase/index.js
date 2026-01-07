require('dotenv').config();

const express = require('express');
const registerController = require('./controller/controller');

const app = express();
app.use(express.json());

app.use('/purchase', registerController);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Purchase service is running on port ${PORT}`);
});