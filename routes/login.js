const express = require('express');
const template = require('../lib/template');
const cookie = require('cookie');

const router = express.Router();

function authIsOwner(req, res) {
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
}

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
  const isOwner = authIsOwner(req, res);
  console.log(isOwner);
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
