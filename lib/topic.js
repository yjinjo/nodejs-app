const db = require('./db');
const template = require('./template');

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
