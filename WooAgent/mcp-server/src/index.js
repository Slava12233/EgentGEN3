/**
 * WooAgent MCP Server
 * 
 * This script initializes and starts the TechSpawn WooCommerce MCP Server
 * with configuration from environment variables.
 */

// Load environment variables
require('dotenv').config();

// Check for required environment variables
const requiredEnvVars = [
  'WOOCOMMERCE_URL',
  'WOOCOMMERCE_CONSUMER_KEY',
  'WOOCOMMERCE_CONSUMER_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
  console.error('Please set these variables in your .env file');
  process.exit(1);
}

// Import the TechSpawn WooCommerce MCP Server
try {
  const WooCommerceMcpServer = require('@techspawn/woocommerce-mcp-server');
  
  // Configure the server
  const config = {
    woocommerce: {
      url: process.env.WOOCOMMERCE_URL,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET
    },
    port: process.env.PORT || 3000
  };
  
  // Start the server
  console.log('Starting WooCommerce MCP Server...');
  console.log(`WooCommerce URL: ${config.woocommerce.url}`);
  console.log(`Server port: ${config.port}`);
  
  const server = new WooCommerceMcpServer(config);
  server.start();
  
  console.log('WooCommerce MCP Server is running');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down WooCommerce MCP Server...');
    server.stop();
    process.exit(0);
  });
} catch (error) {
  console.error('Error starting WooCommerce MCP Server:', error.message);
  console.error('Make sure you have installed @techspawn/woocommerce-mcp-server package');
  process.exit(1);
}
