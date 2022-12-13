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
};
