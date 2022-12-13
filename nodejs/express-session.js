const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();

app.use(
  session({
    secret: 'asdfasd@#41235',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get('/', function (req, res, next) {
  console.log(req.session);
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num += 1;
  }
  res.send(`Views: ${req.session.num}`);
});

app.listen(3000, () => {
  console.log('3000!');
});
