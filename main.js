const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(bodyParser.urlencoded({ extended: false }));
// compress all responses
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
});

app.get('/', (req, res) => {
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

app.get('/page/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1'],
    });
    const list = template.list(req.list);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
    );
    res.send(html);
  });
});

app.get('/create', (req, res) => {
  const title = 'WEB - create';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/create_process" method="POST">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
    ''
  );
  res.send(html);
});

app.post('/create_process', (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    res.writeHead(302, { Location: `/?id=${title}` });
    res.end();
  });
});

app.get('/update/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    const title = req.params.pageId;
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    );
    res.send(html);
  });
});

app.post('/update_process', (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect('/?id=${title}');
    });
  });
});

app.post('/delete_process', (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});

// const http = require('http');
// const url = require('url');
// const topic = require('./lib/topic');
// const author = require('./lib/author');

// const app = http.createServer(function (request, response) {
//   const _url = request.url;
//   const queryData = url.parse(_url, true).query;
//   const pathname = url.parse(_url, true).pathname;

// if (pathname === '/') {
//   if (queryData.id === undefined) {
//     topic.home(request, response);
//   } else {
//     topic.page(request, response);
//   }
// } else if (pathname === '/create') {
//     topic.create(request, response);
//   } else if (pathname === '/create_process') {
//     topic.create_process(request, response);
//   } else if (pathname === '/update') {
//     topic.update(request, response);
//   } else if (pathname === '/update_process') {
//     topic.update_process(request, response);
//   } else if (pathname === '/delete_process') {
//     topic.delete_process(request, response);
//   } else if (pathname === '/author') {
//     author.home(request, response);
//   } else if (pathname === '/author/create_process') {
//     author.create_process(request, response);
//   } else if (pathname === '/author/update') {
//     author.update(request, response);
//   } else if (pathname === '/author/update_process') {
//     author.update_process(request, response);
//   } else if (pathname === '/author/delete_process') {
//     author.delete_process(request, response);
//   } else {
//     response.writeHead(404);
//     response.end('Not Found');
//   }
// });

// app.listen(3000);
