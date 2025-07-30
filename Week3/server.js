var http = require('http');
var routes = require('./route.js');

http.createServer(routes.handleRequest).listen(3000);