const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template');
const db = require('./lib/db');
const topic = require('./lib/topic');

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.page(request, response);
    }
  } else if (pathname === '/create') {
    topic.create(request, response);
  } else if (pathname === '/create_process') {
    topic.create_process(request, response);
  } else if (pathname === '/update') {
    db.query('SELECT * FROM topic', function (error, topics) {
      if (error) {
        throw error;
      }
      db.query(
        `SELECT * FROM topic WHERE id=?`,
        [queryData.id],
        function (error2, topic) {
          if (error2) {
            throw error2;
          }

          db.query(`SELECT * FROM author`, function (error2, authors) {
            const list = template.list(topics);
            const html = template.HTML(
              topic[0].title,
              list,
              `
              <form action="/update_process" method="POST">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${
                  topic[0].title
                }" /></p>
                <p>
                  <textarea name="description" placeholder="description">${
                    topic[0].description
                  }</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit" />
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
        }
      );
    });
  } else if (pathname === '/update_process') {
    let body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      let post = qs.parse(body);
      db.query(
        `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        function (error, result) {
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    });
  } else if (pathname === '/delete_process') {
    let body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      let post = qs.parse(body);
      db.query(
        `DELETE FROM topic WHERE id = ?`,
        [post.id],
        function (error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/` });
          response.end();
        }
      );
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);
