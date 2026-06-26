const fs = require("fs");
const http = require("http");
const path = require("path");
const { execFile, spawn } = require("child_process");

const root = __dirname;
const startPort = 5500;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 - File not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    response.end(data);
  });
}

function openChrome(url) {
  if (process.env.NO_BROWSER === "1") {
    return;
  }

  const chromePaths = [
    path.join(process.env.PROGRAMFILES || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
  ];

  const chromePath = chromePaths.find((candidate) => candidate && fs.existsSync(candidate));

  if (chromePath) {
    execFile(chromePath, [url]);
    return;
  }

  spawn("cmd", ["/c", "start", "chrome", url], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  }).unref();
}

function createServer(port) {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
    const requestedPath = requestUrl.pathname === "/" ? "/home.html" : requestUrl.pathname;
    const filePath = path.normalize(path.join(root, requestedPath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("403 - Forbidden");
      return;
    }

    sendFile(response, filePath);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < startPort + 20) {
      createServer(port + 1);
      return;
    }

    console.error(error.message);
    process.exit(1);
  });

  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;
    console.log(`Serving website at ${url}`);
    console.log("Press Ctrl+C to stop the server.");
    openChrome(url);
  });
}

createServer(startPort);
