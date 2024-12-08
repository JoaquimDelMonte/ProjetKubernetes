const http = require('http');

const hostname = '0.0.0.0'; // Écoute sur toutes les interfaces réseau, y compris celles de Minikube
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello from Node.js app on Minikube!</h1>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
