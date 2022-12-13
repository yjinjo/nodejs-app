const express = require('express');
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const router = express.Router();

require('dotenv').config();

const authData = {
  email: process.env.AUTH_EMAIL,
  password: process.env.AUTH_PASSWORD,
  nickname: process.env.AUTH_NICKNAME,
};

router.get('/login', (req, res) => {
  const title = 'WEB - login';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/auth/login_process" method="POST">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `,
    ''
  );
  res.send(html);
});

router.post('/login_process', (req, res) => {
  const post = req.body;
  const email = post.email;
  const password = post.pwd;

  if (email === authData.email && password === authData.password) {
    req.session.is_logined = true;
    req.session.nickname = authData.nickname;
    res.redirect('/');
  } else {
    res.send('Who?');
  }
});

//   const post = req.body;
//   const title = post.title;
//   const description = post.description;
//   fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
//     res.redirect(`/topic/${title}`);
//   });
// });

// router.get('/create', (req, res) => {
//   if (authIsOwner(req, res) === false) {
//     res.end('Login required!!!');
//     return false;
//   }

//   const title = 'WEB - create';
//   const list = template.list(req.list);
//   const html = template.HTML(
//     title,
//     list,
//     `
//       <form action="/topic/create_process" method="POST">
//         <p><input type="text" name="title" placeholder="title"></p>
//         <p>
//           <textarea name="description" placeholder="description"></textarea>
//         </p>
//         <p>
//           <input type="submit">
//         </p>
//       </form>
//     `,
//     '',
//     authStatusUI(req, res)
//   );
//   res.send(html);
// });

//   const post = req.body;
//   const title = post.title;
//   const description = post.description;
//   fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
//     res.redirect(`/topic/${title}`);
//   });
// });

// router.get('/update/:pageId', (req, res) => {
//   if (authIsOwner(req, res) === false) {
//     res.end('Login required!!!');
//     return false;
//   }

//   const filteredId = path.parse(req.params.pageId).base;
//   fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//     const title = req.params.pageId;
//     const list = template.list(req.list);
//     const html = template.HTML(
//       title,
//       list,
//       `
//         <form action="/topic/update_process" method="post">
//           <input type="hidden" name="id" value="${title}">
//           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//           <p>
//             <textarea name="description" placeholder="description">${description}</textarea>
//           </p>
//           <p>
//             <input type="submit">
//           </p>
//         </form>
//         `,
//       `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
//       authStatusUI(req, res)
//     );
//     res.send(html);
//   });
// });

// router.post('/update_process', (req, res) => {
//   if (authIsOwner(req, res) === false) {
//     res.end('Login required!!!');
//     return false;
//   }

//   const post = req.body;
//   const id = post.id;
//   const title = post.title;
//   const description = post.description;
//   fs.rename(`data/${id}`, `data/${title}`, function (error) {
//     fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
//       res.redirect(`/topic/${title}`);
//     });
//   });
// });

// router.post('/delete_process', (req, res) => {
//   if (authIsOwner(req, res) === false) {
//     res.end('Login required!!!');
//     return false;
//   }

//   const post = req.body;
//   const id = post.id;
//   const filteredId = path.parse(id).base;
//   fs.unlink(`data/${filteredId}`, function (error) {
//     res.redirect('/');
//   });
// });

// router.get('/:pageId', (req, res, next) => {
//   const filteredId = path.parse(req.params.pageId).base;
//   fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//     if (err) {
//       next(err);
//     } else {
//       const title = req.params.pageId;
//       const sanitizedTitle = sanitizeHtml(title);
//       const sanitizedDescription = sanitizeHtml(description, {
//         allowedTags: ['h1'],
//       });
//       const list = template.list(req.list);
//       const html = template.HTML(
//         sanitizedTitle,
//         list,
//         `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//         `<a href="/topic/create">create</a>
//          <a href="/topic/update/${sanitizedTitle}">update</a>
//          <form action="/topic/delete_process" method="post">
//            <input type="hidden" name="id" value="${sanitizedTitle}">
//            <input type="submit" value="delete">
//          </form>
//         `,
//         authStatusUI(req, res)
//       );
//       res.send(html);
//     }
//   });
// });

module.exports = router;
