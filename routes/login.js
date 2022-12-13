const express = require('express');
const template = require('../lib/template');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const title = 'Login';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/login/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>`,
    `<a href="/create">create</a>`
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
