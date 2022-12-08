module.exports = {
  HTML: function (title, list, body, control) {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <title>WEB2 - ${title}</title>
            <meta charset="utf-8" />
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
          </body>
        </html>  
      `;
  },
  list: function (topics) {
    let list = '<ul>';
    let i = 0;
    while (i < topics.length) {
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i += 1;
    }
    list += '</ul>';

    return list;
  },
};
