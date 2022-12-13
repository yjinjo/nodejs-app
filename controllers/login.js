const cookie = require('cookie');

const authSeesionUI = function (req, res) {
  let authStatusUI = '<a href="/auth/login">login</a>';
  if (authSessionOwner(req, res)) {
    authStatusUI = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
  }
  return authStatusUI;
};

const authSessionOwner = function (req, res) {
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
};

const authIsOwner = function (req, res) {
  let isOwner = false;
  let cookies = {};
  if (req.headers.cookie) {
    cookies = cookie.parse(req.headers.cookie);
  }
  if (
    cookies.email === 'egoing777@gmail.com' &&
    cookies.password === '111111'
  ) {
    isOwner = true;
  }
  return isOwner;
};

const authStatusUI = function (req, res) {
  let authStatusUI = '<a href="/login">login</a>';
  if (authIsOwner(req, res)) {
    authStatusUI = '<a href="/logout_process">logout</a>';
  }
  return authStatusUI;
};

module.exports = {
  authSeesionUI,
  authSessionOwner,
  authIsOwner,
  authStatusUI,
};
