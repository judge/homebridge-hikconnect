const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 8000;

http.createServer((request, response) => {
  fs.readFile('./data.json', (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end(error);
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(content, 'utf-8');
    }
  });
}).listen(port, err => {
  if (err) {
    return console.log(err);
  }
  console.log(`server is listening on ${port}`);
});