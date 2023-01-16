require('dotenv').config;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4001;

const start = async () => {
  try {
    app.listen(PORT, () => { console.log(`Server sarted on port ${PORT}`) })
  } catch (e) {
    console.log(e)
  }
};

start();