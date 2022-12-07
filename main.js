const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  if (pathname === '/') {
    console.log(queryData);
    fs.readFile(`data/${title}`, 'utf8', function (err, description) {
      let template = `
      <!DOCTYPE html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
    </html>  
    `;
      response.writeHead(200);
      response.end(template);
    });
  } else {
    console.log(queryData);
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);
