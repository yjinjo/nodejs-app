const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET;
console.log(SESSION_SECRET);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', function (req, res, next) {
  res.send('Hello session');
});

app.listen(3000, () => {
  console.log('3000!');
});
