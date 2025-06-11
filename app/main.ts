import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

class HTTPRequest {
  header: string;
  method: string;
  path: string;
  version: string;
  constructor( data: string){
    // Parse the HTTP request data
    const lines = data.split("\r\n");
    this.header = lines[0];
    [this.method, this.path, this.version] = this.header.split(" ");
  }
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    // console.log("Received data:", data.toString());
    const request = new HTTPRequest(data.toString());
    if (request.method === "GET" && request.path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      return
    }
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.end();
  });
});

server.listen(4221, "localhost");
