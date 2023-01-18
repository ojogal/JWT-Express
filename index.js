const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index.js');
const errors = require('./middlewares/error_middleware.js');

const app = express();
const PORT = process.env.PORT || 4001;

mongoose.set('strictQuery', true);
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
//must be last middleware
app.use(errors);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => { console.log(`Server sarted on port ${PORT}`) })
  } catch (e) {
    console.log(e)
  }
};

start();