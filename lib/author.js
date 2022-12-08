const db = require('./db');
const template = require('./template');
const url = require('url');
const qs = require('querystring');

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error2, authors) {
      const title = 'author';
      const list = template.list(topics);
      const html = template.HTML(
        title,
        list,
        `
        ${template.authorTable(authors)}
        <style>
          table {
            border-collapse: collapse;
          }
          td {
            border: 1px solid black;
          }
        </style>
        <form action="/author/create_process" method="post">
          <p>
            <input type="text" name="name" placeholder="name">
          </p>
          <p>
            <textarea name="profile" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          <p>
        </form>
        `,
        ``
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
      `INSERT INTO author (name, profile) VALUES(?, ?)`,
      [post.name, post.profile],
      function (error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM author`, function (error2, authors) {
      db.query(
        `SELECT * FROM author WHERE id=?`,
        [queryData.id],
        function (error3, author) {
          const title = 'author';
          const list = template.list(topics);
          const html = template.HTML(
            title,
            list,
            `
            ${template.authorTable(authors)}
            <style>
              table {
                border-collapse: collapse;
              }
              td {
                border: 1px solid black;
              }
            </style>
            <form action="/author/update_process" method="post">
              <p>
                <input type="hidden" name="id" value="${queryData.id}">
              <p>
              <p>
                <input type="text" name="name" value="${
                  author[0].name
                }" placeholder="name">
              </p>
              <p>
                <textarea name="profile" placeholder="description">${
                  author[0].profile
                }</textarea>
              </p>
              <p>
                <input type="submit" value="update">
              <p>
            </form>
            `,
            ``
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
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
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      function (error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};