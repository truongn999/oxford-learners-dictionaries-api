const http = require("http");
const data = require("./data");
const port = process.env.PORT || 4000;
const server = http.createServer(data);

console.log("Server running at http://localhost:4000");
console.log("try /api/dictionary/english/hello");
console.log("or use / to test the api with UI");

server.listen(port);
