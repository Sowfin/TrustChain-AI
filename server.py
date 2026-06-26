from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class HomePageHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/home.html"
        return super().do_GET()


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 8000
    server = ThreadingHTTPServer((host, port), HomePageHandler)
    print(f"Serving website at http://{host}:{port}")
    print("Press Ctrl+C to stop the server.")
    server.serve_forever()
