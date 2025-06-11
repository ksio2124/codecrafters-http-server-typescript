export class HTTPHeader {
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