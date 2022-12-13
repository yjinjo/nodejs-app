const cookie = require('cookie');

module.exports = {
  sessionOwner: function (req, res) {
    if (req.session.is_logined) {
      return true;
    } else {
      return false;
    }
  },
  sessionUI: function (req, res) {
    let authStatusUI = '<a href="/auth/login">login</a>';
    if (this.sessionOwner(req, res)) {
      authStatusUI = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authStatusUI;
  },
  isOwner: function (req, res) {
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
  },
  statusUI: function (req, res) {
    let authStatusUI = '<a href="/login">login</a>';
    if (this.isOwner(req, res)) {
      authStatusUI = '<a href="/logout_process">logout</a>';
    }
    return authStatusUI;
  },
};
