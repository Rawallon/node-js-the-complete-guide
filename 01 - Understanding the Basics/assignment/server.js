const http = require('http');

const userList = ['John', 'Mary'];

const app = http.createServer((req, res) => {
  if (req.url !== '/favicon.ico') console.log(req.url);
  const url = req.url;
  const method = req.method;
  res.setHeader('Content-Type', 'text/html');
  if (url === '/') {
    res.write(`
        <html>
        <head> <title>Assignment #1</title></head>
        <body>
            <h1>Hello!</h1>
            <h3>You might want to see <a href="/users">user list</a></h3>
        </body>`);
    return res.end();
  }
  if (url === '/users') {
    res.write('<html>');
    res.write('<head> <title>Assignment #1</title></head>');
    res.write('<body>');
    res.write(`<h3><a href='/'>Back</a></h3>`);
    res.write('<ul>');
    userList.map((user) => res.write(`<ul> ${user}</ul>`));
    res.write('</ul>');
    res.write(`<form action="/create-user" method="POST">
        <input type="text" name="user">
        <button type="submit">Create</button>
        </form>`);
    res.write('</body>');
    return res.end();
  }
  if (url === '/create-user' && method === 'POST') {
    const body = [];
    var pUser = '';
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const user = parsedBody.split('=')[1];
      pUser = user;
      userList.push(user);
      res.writeHead(301, { Location: '/' });
      return res.end();
    });
  }
});

app.listen(3000);
