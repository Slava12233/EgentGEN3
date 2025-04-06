# WooAgent MCP Server

This component provides the MCP (Model Context Protocol) server for WooCommerce integration. It exposes WooCommerce operations as tools that can be used by the AI agent.

## Setup Options

### Option 1: Using TechSpawn WooCommerce MCP Server (Recommended)

1. Install the TechSpawn WooCommerce MCP Server:
   ```
   npm install @techspawn/woocommerce-mcp-server
   ```

2. Configure the server with your WooCommerce credentials in `.env` file:
   ```
   WOOCOMMERCE_URL=https://your-store.com
   WOOCOMMERCE_CONSUMER_KEY=your_consumer_key_here
   WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
   ```

3. Start the server:
   ```
   npx woocommerce-mcp-server
   ```

### Option 2: Custom MCP Server Implementation

If the TechSpawn server doesn't meet all requirements, we can implement a custom MCP server:

1. Install required dependencies:
   ```
   npm install woocommerce-rest-api easy-mcp express
   ```

2. Configure and implement the server using the files in `src/` directory.

## Available Tools

The MCP server exposes the following WooCommerce operations as tools:

- Product operations (list, get, create, update, delete)
- Order operations (list, get, create, update)
- Customer operations (list, get, create, update)
- Coupon operations (list, get, create, update, delete)

## Testing

Use the scripts in the `tests/` directory to verify the functionality of the MCP server.
