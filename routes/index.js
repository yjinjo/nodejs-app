const express = require('express');
const template = require('../lib/template');
const router = express.Router();
const authStatusUI = require('../controllers/login');

router.get('/', (req, res) => {
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 10px;">`,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
});

router.get('/login', (req, res) => {
  const title = 'Login';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>`,
    `<a href="/topic/create">create</a>`,
    authStatusUI(req, res)
  );

  res.send(html);
});

router.post('/login_process', (req, res) => {
  const post = req.body;

  if (post.email === 'egoing777@gmail.com' && post.password === '111111') {
    res.writeHead(302, {
      'Set-Cookie': [
        `email=${post.email}`,
        `password=${post.password}`,
        `nickname=egoing`,
      ],
      Location: '/',
    });
    res.end();
  } else {
    res.end('Who?');
  }
});

module.exports = router;
