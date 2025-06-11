import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

class HTTPRequest {
  header: string;
  method: string;
  path: string[];
  version: string;
  constructor( data: string){
    // Parse the HTTP request data
    const lines = data.split("\r\n");
    this.header = lines[0];
    let fullPath = '';
    [this.method, fullPath, this.version] = this.header.split(" ");
    this.path = fullPath.split("/");
  }
}

class HTTPResponse {
  statusCode: number;
  statusMessage: string;
  header: HTTPHeader;
  body: string;
  constructor(statusCode: number, statusMessage: string, body: string, header: HTTPHeader) {
    this.header = header;
    this.body = body;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }

  toString() {
    return `HTTP/1.1 ${this.statusCode} ${this.statusMessage}\r\n${this.header.getHeadersAsString()}\r\n\r\n${this.body}`;
  }
}
class HTTPHeader {
  headers: Record<string, string>;
  constructor() {
    this.headers = {};
  }
  addHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  getheaders() {
    return this.headers;
  }
  getHeadersAsString() {
    return Object.entries(this.headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");
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
    console.log("path: ",request.path);
    if (request.method === "GET" && request.path.length === 2 && request.path[0] === "" && request.path[1] === "") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (request.method === "GET" && request.path[1] === "echo") {
      const reponseHeader = new HTTPHeader();
      reponseHeader.addHeader("Content-Type", "text/plain");
      reponseHeader.addHeader("Content-Length", request.path[2].length.toString());
      const response = new HTTPResponse(200, "OK", request.path[2], reponseHeader);
      socket.write(response.toString());
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
