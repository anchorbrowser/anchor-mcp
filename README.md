# Anchor MCP Server

A Model Context Protocol (MCP) server that provides browser automation capabilities using [Anchor Browser](https://anchorbrowser.io)'s remote browser service with [Playwright](https://playwright.dev). This server enables LLMs to interact with web pages through Anchor's cloud-based browsers with built-in proxies, stealth features, and advanced capabilities.

## Key Features

- **Remote Browser Execution**: Uses Anchor Browser's cloud infrastructure instead of local browsers
- **Built-in Proxies**: Automatic residential proxy rotation and geo-targeting  
- **Stealth & Anti-Detection**: Advanced browser fingerprinting and anti-bot detection
- **Fast and lightweight**: Uses Playwright's accessibility tree, not pixel-based input
- **LLM-friendly**: No vision models needed, operates purely on structured data
- **Deterministic tool application**: Avoids ambiguity common with screenshot-based approaches

## Requirements

- Node.js 18 or newer
- **Anchor Browser API Key** ([Get one here](https://anchorbrowser.io))
- VS Code, Cursor, Windsurf, Claude Desktop, Goose or any other MCP client

## Getting Started

### 1. Clone and Build

Since this is a custom Anchor MCP server, you need to build it locally:

```bash
# Clone the repository
git clone https://github.com/anchorbrowser/anchor-mcp.git
cd anchor-mcp

# Install dependencies and build
npm install
npm run build
```

### 2. Get Your Anchor API Key

1. Sign up at [anchorbrowser.io](https://anchorbrowser.io)
2. Get your API key from the dashboard
3. Copy your API key (starts with `sk-`)

### 3. Configure MCP Client

#### Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "anchor-browser": {
      "command": "node",
      "args": [
        "/path/to/anchor-mcp/cli.js"
      ],
      "env": {
        "ANCHOR_API_KEY": "sk-your-api-key-here"
      }
    }
  }
}
```

#### VS Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "anchor-browser": {
      "command": "node",
      "args": [
        "/path/to/anchor-mcp/cli.js"
      ],
      "env": {
        "ANCHOR_API_KEY": "sk-your-api-key-here"
      }
    }
  }
}
```

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "anchor-browser": {
      "command": "node",
      "args": [
        "/path/to/anchor-mcp/cli.js"
      ],
      "env": {
        "ANCHOR_API_KEY": "sk-your-api-key-here"
      }
    }
  }
}
```

### 4. Restart Your MCP Client

After updating the configuration, restart your MCP client (Cursor, VS Code, etc.) to load the new server.

## Configuration Options

The Anchor MCP server supports only essential configuration options:

```bash
node cli.js --help
```

### Available Options:

- `--host <host>` - Host to bind server to (default: localhost, use 0.0.0.0 for all interfaces)
- `--port <port>` - Port to listen on for HTTP transport (Docker/server mode)

### Example with Options:

```json
{
  "mcpServers": {
    "anchor-browser": {
      "command": "node",
      "args": [
        "/path/to/anchor-mcp/cli.js",
      ],
      "env": {
        "ANCHOR_API_KEY": "sk-your-api-key-here"
      }
    }
  }
}
```

### HTTP Server Mode (Docker):

For Docker or headless server environments:

```bash
# Run as HTTP server
ANCHOR_API_KEY="sk-your-key" node cli.js --port 8931 --host 0.0.0.0
```

Then configure your MCP client to use the HTTP endpoint:

```json
{
  "mcpServers": {
    "anchor-browser": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

### Why So Few Options?

Since Anchor Browser handles all the complex browser management remotely, most traditional browser options are unnecessary:

- **No browser selection** - Anchor uses optimized remote browsers
- **No proxy configuration** - Anchor provides built-in proxy rotation  
- **No browser profile management** - Handled by Anchor's infrastructure
- **No network filtering** - Use Anchor's dashboard for advanced controls
- **No viewport/device options** - Configure these through Anchor Browser API

This keeps the MCP server simple and focused on what matters: connecting to Anchor's remote browser service.

## How It Works

1. **Browser Session Creation**: When you use browser tools, the MCP server calls Anchor's API to create a remote browser session
2. **Remote Connection**: Connects to the remote browser via WebSocket using Chrome DevTools Protocol (CDP)
3. **Tool Execution**: All browser automation happens in Anchor's cloud infrastructure
4. **Proxy & Stealth**: Automatic residential proxy rotation and advanced anti-detection features
5. **Session Management**: Each session is isolated and can be viewed live via Anchor's dashboard

## Benefits Over Local Browsers

### 🌐 **Global Proxy Network**
- Automatic residential proxy rotation
- Geo-targeting for different regions
- No proxy configuration needed

### 🛡️ **Advanced Stealth**
- Browser fingerprinting protection
- Anti-bot detection bypass
- Real browser environments

### ☁️ **Cloud Infrastructure**
- No local browser dependencies
- Consistent browser versions
- Scalable execution

### 📊 **Monitoring & Debugging**
- Live view of browser sessions
- Session recordings and traces
- Network request logging

## Available Tools

The Anchor MCP server provides all standard browser automation tools:

### Core Automation
- `anchor_navigate` - Navigate to URLs
- `anchor_click` - Click elements
- `browser_type` - Type text into inputs
- `browser_snapshot` - Get page accessibility tree
- `browser_take_screenshot` - Take screenshots
- `browser_evaluate` - Execute JavaScript
- `browser_wait_for` - Wait for conditions

### Tab Management
- `browser_tab_new` - Open new tabs
- `browser_tab_list` - List open tabs
- `browser_tab_select` - Switch between tabs
- `browser_tab_close` - Close tabs

### Advanced Features
- `browser_file_upload` - Upload files
- `browser_handle_dialog` - Handle alerts/confirms
- `browser_network_requests` - View network traffic
- `browser_pdf_save` - Generate PDFs (with `--caps=pdf`)

## Troubleshooting

### Invalid API Key
```
Error: Missing ANCHOR_API_KEY environment variable
```
**Solution**: Make sure your API key is correctly set in the MCP configuration.

### Build Errors
```
npm run build
```
**Solution**: Make sure you have Node.js 18+ and run `npm install` first.

### Connection Issues
Check the MCP logs for Anchor API responses and WebSocket connection status.

### Session Limits
Each Anchor API key has session limits. Check your dashboard at [anchorbrowser.io](https://anchorbrowser.io) for usage.

## Development

To modify or extend the Anchor MCP server:

```bash
# Make changes to TypeScript files in src/
# Then rebuild
npm run build

# Test your changes
node cli.js --help
```

The server will automatically use Anchor's remote browsers for all operations, providing the benefits of cloud-based browser automation with advanced proxy and stealth capabilities.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Support

- **Anchor Browser**: [anchorbrowser.io](https://anchorbrowser.io)
- **Documentation**: [Anchor Browser Docs](https://docs.anchorbrowser.io)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)
