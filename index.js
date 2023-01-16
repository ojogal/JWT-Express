const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
dotenv.config();
mongoose.set('strictQuery', true);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => { console.log(`Server sarted on port ${PORT}`) })
  } catch (e) {
    console.log(e)
  }
};

start();