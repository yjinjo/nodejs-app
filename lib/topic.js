const db = require('./db');
const template = require('./template');
const url = require('url');
const qs = require('querystring');
const sanitizeHTML = require('sanitize-html');

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.list(topics);
    const html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );

    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;

  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error;
    }
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) {
          throw error2;
        }
        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.list(topics);
        const html = template.HTML(
          title,
          list,
          `<h2>${sanitizeHTML(title)}</h2>${sanitizeHTML(
            description
          )} <p>by ${sanitizeHTML(topic[0].name)}</p>`,
          `<a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
               <form action="delete_process" method="POST">
                 <input type="hidden" name="id" value="${queryData.id}">
                 <input type="submit" value="delete">
               </form>
              `
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error2, authors) {
      const title = 'Create';
      const list = template.list(topics);
      const html = template.HTML(
        sanitizeHTML(title),
        list,
        `<form action="/create_process" method="POST">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  let body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    let post = qs.parse(body);
    db.query(
      `INSERT INTO topic (title, description, created, author_id) 
          VALUES(?, ?, NOW(), ?);`,
      // [post.title, post.description, 1],
      [post.title, post.description, post.author],
      function (error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;

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
            sanitizeHTML(topic[0].title),
            list,
            `
            <form action="/update_process" method="POST">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p>
                <input type="text" name="title" placeholder="title" value="${sanitizeHTML(
                  topic[0].title
                )}" />
              </p>
              <p>
                <textarea name="description" placeholder="description">${sanitizeHTML(
                  topic[0].description
                )}</textarea>
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
};

exports.update_process = function (request, response) {
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
};

exports.delete_process = function (request, response) {
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
};
