import { HTTPHeader } from './HTTPHeader';

export class HTTPResponse {
  statusCode: number;
  statusMessage: string;
  header: HTTPHeader;
  body: string;
  constructor(
    statusCode: number,
    statusMessage: string,
    body: string,
    header: HTTPHeader
  ) {
    this.header = header;
    this.body = body;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }

  toString() {
    return `HTTP/1.1 ${this.statusCode} ${
      this.statusMessage
    }\r\n${this.header.getHeadersAsString()}\r\n\r\n${this.body}`;
  }
}