const express = require('express');
const app = express();
const fs = require('fs');

const bodyParser = require('body-parser');
const compression = require('compression');
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// compress all responses
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
});

app.use('/', indexRouter);

app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
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
