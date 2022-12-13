const express = require('express');
const template = require('../lib/template');
const router = express.Router();
const login = require('../controllers/login');

router.get('/', (req, res) => {
  console.log('/', req.user);
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 10px;">`,
    `<a href="/topic/create">create</a>`,
    login.sessionUI(req, res)
  );
  res.send(html);
});

module.exports = router;
