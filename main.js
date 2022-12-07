const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, filelist) {
        let title = 'Welcome';
        let description = 'Hello, Node.js';

        let list = '<ul>';
        let i = 0;
        while (i < filelist.length) {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';

        let template = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8" />
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
          </html>  
        `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function (err, filelist) {
        let list = '<ul>';
        let i = 0;
        while (i < filelist.length) {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';

        fs.readFile(
          `data/${queryData.id}`,
          'utf8',
          function (err, description) {
            let title = queryData.id;
            let template = `
              <!DOCTYPE html>
              <html>
                <head>
                  <title>WEB1 - ${title}</title>
                  <meta charset="utf-8" />
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  ${list}
                  <h2>${title}</h2>
                  <p>${description}</p>
                </body>
              </html>  
            `;
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);
