const express = require('express');
const app = express();
const fs = require('fs');

const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
require('dotenv').config();

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
  session({
    HttpOnly: true,
    secure: true,
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

const authData = {
  email: process.env.AUTH_EMAIL,
  password: process.env.AUTH_PASSWORD,
  nickname: process.env.AUTH_NICKNAME,
};

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log('serializerUser', user);
  done(null, user.email);
  // done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser', id);
  done(null, authData);
  // user.findById(id, function (err, user) {
  //   done(err, user);
  // });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd',
    },
    function (username, password, done) {
      console.log('LocalStrategy', username, password);
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          // return done(null, user);
          return done(null, authData);
        } else {
          console.log(3);
          return done(null, false, {
            message: 'Incorrect password.',
          });
        }
      } else {
        console.log(4);
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }
    }
  )
);

app.post(
  '/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
);

app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
});

const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});
