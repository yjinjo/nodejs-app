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
      <form action="/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>`,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

module.exports = router;
