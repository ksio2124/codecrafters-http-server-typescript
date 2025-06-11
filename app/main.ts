import * as net from "net";
import { HTTPHeader } from "./HTTPHeader";
import { HTTPResponse } from "./HTTPResponse";
import { HTTPRequest } from "./HTTPRequest";
import { SocketOnDataHandler } from "./SocketOnDataHandler";
import { Socket } from "dgram";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket;
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", async (data) => {
    // console.log("Received data:", data.toString());
    const request = new HTTPRequest(data.toString());
    if (
      request.method === "GET" &&
      request.path.length === 2 &&
      request.path[0] === "" &&
      request.path[1] === ""
    ) {
      SocketOnDataHandler.handleRootRequest(socket, request);
    } else if (request.method === "GET" && request.path[1] === "echo") {
      SocketOnDataHandler.handleEchoRequest(socket, request);
    } else if (request.method === "GET" && request.path[1] === "user-agent") {
      SocketOnDataHandler.handleUserAgentRequest(socket, request);
    } else if (
      request.method === "GET" &&
      request.path[1] === "files"
    ) {
      await SocketOnDataHandler.handleFileRequest(socket, request);
    } else if (request.method === "POST" && request.path[1] === "files") {
      await SocketOnDataHandler.handleFilePostRequest(socket, request);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    if (request.headers.getheaders()["Connection"] === "close") {
      socket.end();
    }
  });
});

server.listen(4221, "localhost");
