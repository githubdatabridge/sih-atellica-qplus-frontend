const express = require("express");
const app = express(); // create express app

const dotenv = require("dotenv");
const path = require("path");
const config = dotenv.config();

// add middleware
app.use(express.static(path.join(__dirname, 'build')));

const port = process.env["PORT"]
  
app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });