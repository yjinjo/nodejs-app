const http = require('http');
const fs = require('fs');
const url = require('url');

function templateHTML(title, list, body) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
      </body>
    </html>  
  `;
}

function templateList(filelist) {
  let list = '<ul>';
  let i = 0;
  while (i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i += 1;
  }
  list += '</ul>';

  return list;
}

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, filelist) {
        const title = 'Welcome';
        const description = 'Hello, Node.js';

        const list = templateList(filelist);

        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function (err, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          'utf8',
          function (err, description) {
            const title = queryData.id;
            const list = templateList(filelist);
            const template = templateHTML(
              title,
              list,
              `<h2>${title}</h2>${description}`
            );

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
