Close any existing Chrome instances and open Chrome with remote debugging enabled on port 9222.

**Prerequisites:**
- Install the chrome-devtools-mcp server: https://github.com/ChromeDevTools/chrome-devtools-mcp

Follow these steps:

1. Kill all running Chrome processes:
   - On macOS: `pkill -9 "Google Chrome"`

2. Launch Chrome with remote debugging enabled:
   - On macOS: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable &`

3. Confirm Chrome is running with remote debugging by checking the debug endpoint:
   - Run: `curl -s http://127.0.0.1:9222/json/version`

4. Report the Chrome version and WebSocket debugger URL to the user.

**Important Notes:**
- Chrome requires a non-default user data directory when enabling remote debugging for security reasons
- The `&` at the end runs Chrome in the background
- Remote debugging port 9222 is the standard port for Chrome DevTools Protocol
- This setup allows the chrome-devtools-mcp server to connect via `--browser-url=http://127.0.0.1:9222`
