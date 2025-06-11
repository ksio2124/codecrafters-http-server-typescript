# TypeScript HTTP Server

A bare-bones HTTP server implementation using TypeScript and Node.js net sockets. This project uses devenv for dependency management.

[![progress-banner](https://backend.codecrafters.io/progress/http-server/9103e0f4-6cb5-4b0f-9a48-3a12258f2b81)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

## Features

- Basic HTTP/1.1 server implementation
- Socket-based networking
- Request parsing and response formatting
- File serving capabilities

## Prerequisites

- [Nix package manager](https://nixos.org/download.html)
- [devenv](https://devenv.sh/getting-started/)

## Tech Stack

- TypeScript
- Node.js net module
- Bun runtime

## Available Endpoints

### GET `/`
- Root endpoint
- Returns a 200 OK response with empty body
- Used to verify server is running

### GET `/echo/<message>`
- Echo endpoint that returns the provided message
- The message must be URL encoded
- Returns the message in response body with Content-Type: text/plain
- Example: `/echo/hello` returns "hello"

### GET `/user-agent` 
- Returns the User-Agent header from the request
- Content-Type: text/plain
- Example response: "curl/7.64.1"

### GET `/files/<filename>`
- Serves static files from the configured directory
- Returns 404 if file not found
- Returns file contents with appropriate Content-Type
- Example: `/files/example.txt`

### POST `/files/<filename>`
- Uploads a file to the configured directory
- Request body contains the file contents
- Returns 201 Created on success
- Example: `POST /files/test.txt` with file contents in body

### Common Response Headers
All endpoints return standard HTTP/1.1 headers:
```
HTTP/1.1 {status}
Content-Type: {type}
Content-Length: {length}
```

### Error Responses
- 404 Not Found - Resource doesn't exist
- 405 Method Not Allowed - Invalid HTTP method  
- 500 Internal Server Error - Server error

## Project Structure

```
app/
├── HTTPHeader.ts    # HTTP header handling
├── HTTPRequest.ts   # HTTP request parsing
├── HTTPResponse.ts  # HTTP response formatting
└── main.ts         # Server entry point
```

## Getting Started

1. Clone the repository

2. Initialize devenv:
   ```bash
   devenv init
   ```

3. Enter development shell:
   ```bash
   devenv shell
   ```

4. Install dependencies:
   ```bash
   bun install
   ```

5. Run the server:
   ```bash
   bun run dev
   ```

The server will start on `localhost:4221`

## Development

This is part of the CodeCrafters HTTP server challenge, implementing a basic HTTP/1.1 server from scratch using TypeScript. The project focuses on low-level networking concepts and HTTP protocol implementation.

## License

MIT