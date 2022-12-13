const http = require('http');
http
  .createServer((req, res) => {
    res.writeHead(200, {
      'Set-Cookie': ['yummy-cookie=choco', 'tasty_cookie=strawberry'],
    });
    res.end('Cookie!!');
  })
  .listen(3000);
