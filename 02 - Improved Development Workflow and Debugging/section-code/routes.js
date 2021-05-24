const fs = require('fs');
function requestHandler(req, res) {
  // Might be worth logging "req"
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    // Ps: The page could be written in a single Write
    res.write('<html>');
    res.write(`<head> <title>Enter Message</title> </head>`);
    res.write(`<body>`);
    res.write(`<body> <h1>Talk to me</h1> `);
    res.write(
      `<form action="/message" method="POST"> 
      <input type="text" name="message" /> 
      <button type="submit">Send!</button> 
      </form>`,
    );
    res.write(`</body>`);
    res.write('</html>');
    // Return here makes it not run the rest of the function
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    // .on works as addEventListener
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      console.log('New message: ' + message);
      // Since this function would block thread...
      // it's now async, thus a cb function is passed.
      fs.writeFile('message.txt', message, (err) => {
        res.writeHead(302, { Location: '/' });
        // Could also be written as
        //res.statusCode = 302;
        //res.setHeader('Location','/')
        res.end();
      });
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write(`<head> <title>Hello from the World Wide Web</title> </head>`);
  res.write(`<body> <h1>Hello World</h1> </body>`);
  res.write('</html>');
  res.end();
}

module.exports = requestHandler;
