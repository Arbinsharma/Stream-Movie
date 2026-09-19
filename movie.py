import http.server
import socketserver
import webbrowser

PORT = 8000

# Serve files from the current directory
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Local Server started at http://localhost:{PORT}")
    print("Serving Stream Movie locally...")
    
    # Automatically open your default web browser
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()
        