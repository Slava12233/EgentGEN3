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
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
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
    this.server = new Server(
      {
        name: 'woocommerce-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupTools();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupTools() {
    // List all tools
    this.server.setRequestHandler({
      method: 'list_tools',
      params: {}
    }, async () => ({
      tools: [
        {
          name: 'list_products',
          description: 'List all products in the store',
          inputSchema: {
            type: 'object',
            properties: {
              per_page: {
                type: 'number',
                description: 'Number of products per page',
              },
              page: {
                type: 'number',
                description: 'Page number',
              }
            }
          }
        },
        {
          name: 'get_product',
          description: 'Get a specific product by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Product ID',
              }
            },
            required: ['id']
          }
        },
        {
          name: 'create_product',
          description: 'Create a new product',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Product name',
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
            },
            required: ['name']
          }
        },
        {
          name: 'update_product',
          description: 'Update an existing product',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Product ID',
              },
              name: {
                type: 'string',
                description: 'Product name',
              },
              regular_price: {
                type: 'string',
                description: 'Product regular price',
              }
            },
            required: ['id']
          }
        },
        {
          name: 'list_orders',
          description: 'List all orders in the store',
          inputSchema: {
            type: 'object',
            properties: {
              per_page: {
                type: 'number',
                description: 'Number of orders per page',
              },
              page: {
                type: 'number',
                description: 'Page number',
              }
            }
          }
        },
        {
          name: 'get_order',
          description: 'Get a specific order by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Order ID',
              }
            },
            required: ['id']
          }
        },
        {
          name: 'update_order',
          description: 'Update an existing order',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Order ID',
              },
              status: {
                type: 'string',
                description: 'Order status',
              }
            },
            required: ['id']
          }
        },
        {
          name: 'list_coupons',
          description: 'List all coupons in the store',
          inputSchema: {
            type: 'object',
            properties: {
              per_page: {
                type: 'number',
                description: 'Number of coupons per page',
              },
              page: {
                type: 'number',
                description: 'Page number',
              }
            }
          }
        },
        {
          name: 'create_coupon',
          description: 'Create a new coupon',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Coupon code',
              },
              discount_type: {
                type: 'string',
                description: 'Discount type',
              },
              amount: {
                type: 'string',
                description: 'Coupon amount',
              }
            },
            required: ['code', 'discount_type', 'amount']
          }
        }
      ]
    }));

    // Call tool handler
    this.server.setRequestHandler({
      method: 'call_tool',
      params: {
        name: { type: 'string' },
        arguments: { type: 'object' }
      }
    }, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        let result;
        
        switch (name) {
          case 'list_products':
            result = await woocommerce.get('products', args);
            break;
          case 'get_product':
            result = await woocommerce.get(`products/${args.id}`);
            break;
          case 'create_product':
            result = await woocommerce.post('products', args);
            break;
          case 'update_product':
            result = await woocommerce.put(`products/${args.id}`, args);
            break;
          case 'list_orders':
            result = await woocommerce.get('orders', args);
            break;
          case 'get_order':
            result = await woocommerce.get(`orders/${args.id}`);
            break;
          case 'update_order':
            result = await woocommerce.put(`orders/${args.id}`, args);
            break;
          case 'list_coupons':
            result = await woocommerce.get('coupons', args);
            break;
          case 'create_coupon':
            result = await woocommerce.post('coupons', args);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error(`Error calling tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
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
    await this.server.connect(transport);
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
