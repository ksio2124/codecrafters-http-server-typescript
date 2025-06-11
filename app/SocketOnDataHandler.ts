import { HTTPHeader } from "./HTTPHeader";
import net from "net";
import { HTTPResponse } from "./HTTPResponse";
import { HTTPRequest } from "./HTTPRequest";

export class SocketOnDataHandler {

  static handleRootRequest(socket: net.Socket, request: HTTPRequest) {
    if (request.headers.getheaders()["Connection"] !== "close") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      return;
    }
    let responseHeader = new HTTPHeader();
    responseHeader = SocketOnDataHandler.handleConnectionClose(
      responseHeader,
      request
    );
    const response = new HTTPResponse(
      200,
      "OK",
      "",
      responseHeader
    );
    socket.write(response.getHeaderAsString());
  }
  static getEncodedContent(
    request: HTTPRequest,
    content: string
  ): [Uint8Array | string, string | null] {
    const acceptEncodingSet = new Set(
      request.headers.getheaders()["Accept-Encoding"]?.split(", ") || []
    );
    if (acceptEncodingSet.has("gzip")) {
      return [Bun.gzipSync(content), "gzip"];
    }
    return [content, null];
  }

  static async handleFileRequest(socket: net.Socket, request: HTTPRequest) {
    const fileDirArgIdx = Bun.argv.indexOf("--directory") + 1;
    const fileDir = fileDirArgIdx === 0 ? null : Bun.argv[fileDirArgIdx];
    if (!fileDir) {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      return;
    }
    const fileName = request.path.slice(2).join("/");
    const filePath = `${fileDir}/${fileName}`;
    // access the file system to read the file and send it back as ocetstream
    try {
      const fileContent = await Bun.file(filePath).text();
      const responseHeader = new HTTPHeader();
      responseHeader.addHeader("Content-Type", "application/octet-stream");
      responseHeader.addHeader("Content-Length", fileContent.length.toString());
      const response = new HTTPResponse(200, "OK", fileContent, responseHeader);
      socket.write(response.toString());
    } catch (error) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  }

  static async handleFilePostRequest(socket: net.Socket, request: HTTPRequest) {
    const fileDirArgIdx = Bun.argv.indexOf("--directory") + 1;
    const fileDir = fileDirArgIdx === 0 ? null : Bun.argv[fileDirArgIdx];
    if (!fileDir) {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      return;
    }
    const fileName = request.path.slice(2).join("/");
    const filePath = `${fileDir}/${fileName}`;
    // access the file system to write the file
    try {
      await Bun.write(filePath, request.body);
      const responseHeader = new HTTPHeader();
      const response = new HTTPResponse(201, "Created", "", responseHeader);
      socket.write(response.toString());
    } catch (error) {
      socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
    }
  }

  static handleEchoRequest(socket: net.Socket, request: HTTPRequest) {
    let responseHeader = new HTTPHeader();
    responseHeader.addHeader("Content-Type", "text/plain");
    responseHeader = SocketOnDataHandler.handleConnectionClose(
      responseHeader,
      request
    );
    const [content, encoding] = this.getEncodedContent(
      request,
      request.path[2]
    );
    responseHeader.addHeader("Content-Length", content.length.toString());
    if (encoding) {
      responseHeader.addHeader("Content-Encoding", encoding);
    }
    const response = new HTTPResponse(
      200,
      "OK",
      content,
      responseHeader
    );
    // socket.write(response.toString());
    socket.write(response.getHeaderAsString());
    socket.write(content);
  }

  static handleUserAgentRequest(socket: net.Socket, request: HTTPRequest) {
    const responseHeader = new HTTPHeader();
    responseHeader.addHeader("Content-Type", "text/plain");
    responseHeader.addHeader(
      "Content-Length",
      request.headers.getheaders()["User-Agent"].length.toString()
    );
    const response = new HTTPResponse(
      200,
      "OK",
      request.headers.getheaders()["User-Agent"],
      responseHeader
    );
    socket.write(response.toString());
  }

  static handleConnectionClose(responseHeader: HTTPHeader,request: HTTPRequest) {
    // Handle connection close logic if needed
    if (request.headers.getheaders()["Connection"] === "close") {
      responseHeader.addHeader("Connection", "close");
    }
    return responseHeader;
  }
}
