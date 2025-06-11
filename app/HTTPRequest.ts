import { HTTPHeader } from "./HTTPHeader";

export class HTTPRequest {
  method: string;
  path: string[];
  version: string;
  headers: HTTPHeader;
  body: string;
  constructor(data: string) {
    // Parse the HTTP request data
    const lines = data.split("\r\n");
    let requestLine = lines[0];
    let fullPath = "";
    [this.method, fullPath, this.version] = requestLine.split(" ");
    this.path = fullPath.split("/");
    let rest = lines.slice(1);
    this.headers = new HTTPHeader();
    let restIdx = 0;
    while (restIdx < rest.length && rest[restIdx] !== "") {
      const [name, value] = rest[restIdx].split(": ");
      this.headers.addHeader(name, value);
      restIdx++;
    }
    this.body = rest.slice(restIdx).join("");
  }
}