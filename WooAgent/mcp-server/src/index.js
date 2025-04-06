/**
 * WooAgent MCP Server
 * 
 * This script initializes and starts a WooCommerce MCP Server
 * with configuration from environment variables.
 */

// Load environment variables
require('dotenv').config();

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/transports/stdio');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

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

// Initialize WooCommerce API
const woocommerce = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: 'wc/v3'
});

// Initialize Express app for HTTP API
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize MCP Server
class WooCommerceMcpServer {
  constructor() {
    this.server = new Server({
      name: 'woocommerce-mcp-server',
      version: '0.1.0',
    });

    this.setupTools();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupTools() {
    // Register tools
    this.server.registerTool('list_products', {
      description: 'List all products in the store',
      parameters: {
        per_page: {
          type: 'number',
          description: 'Number of products per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.get('products', args);
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
    });

    this.server.registerTool('get_product', {
      description: 'Get a specific product by ID',
      parameters: {
        id: {
          type: 'number',
          description: 'Product ID',
          required: true
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.get(`products/${args.id}`);
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching product ${args.id}: ${error.message}`);
      }
    });

    this.server.registerTool('create_product', {
      description: 'Create a new product',
      parameters: {
        name: {
          type: 'string',
          description: 'Product name',
          required: true
        },
        type: {
          type: 'string',
          description: 'Product type',
        },
        regular_price: {
          type: 'string',
          description: 'Product regular price',
        },
        description: {
          type: 'string',
          description: 'Product description',
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.post('products', args);
        return response.data;
      } catch (error) {
        throw new Error(`Error creating product: ${error.message}`);
      }
    });

    this.server.registerTool('update_product', {
      description: 'Update an existing product',
      parameters: {
        id: {
          type: 'number',
          description: 'Product ID',
          required: true
        },
        name: {
          type: 'string',
          description: 'Product name',
        },
        regular_price: {
          type: 'string',
          description: 'Product regular price',
        }
      }
    }, async (args) => {
      const { id, ...data } = args;
      try {
        const response = await woocommerce.put(`products/${id}`, data);
        return response.data;
      } catch (error) {
        throw new Error(`Error updating product ${id}: ${error.message}`);
      }
    });

    this.server.registerTool('list_orders', {
      description: 'List all orders in the store',
      parameters: {
        per_page: {
          type: 'number',
          description: 'Number of orders per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.get('orders', args);
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }
    });

    this.server.registerTool('get_order', {
      description: 'Get a specific order by ID',
      parameters: {
        id: {
          type: 'number',
          description: 'Order ID',
          required: true
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.get(`orders/${args.id}`);
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching order ${args.id}: ${error.message}`);
      }
    });

    this.server.registerTool('update_order', {
      description: 'Update an existing order',
      parameters: {
        id: {
          type: 'number',
          description: 'Order ID',
          required: true
        },
        status: {
          type: 'string',
          description: 'Order status',
        }
      }
    }, async (args) => {
      const { id, ...data } = args;
      try {
        const response = await woocommerce.put(`orders/${id}`, data);
        return response.data;
      } catch (error) {
        throw new Error(`Error updating order ${id}: ${error.message}`);
      }
    });

    this.server.registerTool('list_coupons', {
      description: 'List all coupons in the store',
      parameters: {
        per_page: {
          type: 'number',
          description: 'Number of coupons per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.get('coupons', args);
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching coupons: ${error.message}`);
      }
    });

    this.server.registerTool('create_coupon', {
      description: 'Create a new coupon',
      parameters: {
        code: {
          type: 'string',
          description: 'Coupon code',
          required: true
        },
        discount_type: {
          type: 'string',
          description: 'Discount type',
          required: true
        },
        amount: {
          type: 'string',
          description: 'Coupon amount',
          required: true
        }
      }
    }, async (args) => {
      try {
        const response = await woocommerce.post('coupons', args);
        return response.data;
      } catch (error) {
        throw new Error(`Error creating coupon: ${error.message}`);
      }
    });
  }

  async start() {
    // Start HTTP API
    app.listen(PORT, () => {
      console.log(`HTTP API running on port ${PORT}`);
    });

    // Start MCP Server
    const transport = new StdioServerTransport();
    await this.server.listen(transport);
    console.log('WooCommerce MCP server running on stdio');
  }
}

// Start the server
console.log('Starting WooCommerce MCP Server...');
console.log(`WooCommerce URL: ${process.env.WOOCOMMERCE_URL}`);
console.log(`Server port: ${PORT}`);

const server = new WooCommerceMcpServer();
server.start().catch(error => {
  console.error('Error starting WooCommerce MCP Server:', error);
  process.exit(1);
});
