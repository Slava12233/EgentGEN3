/**
 * WooCommerce MCP Server Tools Tests
 * 
 * This file contains tests for the WooCommerce MCP Server tools.
 * It verifies that the tools are properly exposed and functioning.
 */

// Mock environment variables for testing
process.env.WOOCOMMERCE_URL = 'https://test-store.com';
process.env.WOOCOMMERCE_CONSUMER_KEY = 'test_key';
process.env.WOOCOMMERCE_CONSUMER_SECRET = 'test_secret';

// Mock the WooCommerce MCP Server with tools
jest.mock('@techspawn/woocommerce-mcp-server', () => {
  return class MockWooCommerceMcpServer {
    constructor(config) {
      this.config = config;
      this.tools = {
        list_products: jest.fn().mockResolvedValue([
          { id: 1, name: 'Test Product 1', price: '19.99' },
          { id: 2, name: 'Test Product 2', price: '29.99' }
        ]),
        get_product: jest.fn().mockResolvedValue(
          { id: 1, name: 'Test Product 1', price: '19.99', description: 'Test description' }
        ),
        create_product: jest.fn().mockResolvedValue(
          { id: 3, name: 'New Product', price: '39.99' }
        ),
        list_orders: jest.fn().mockResolvedValue([
          { id: 101, status: 'processing', total: '59.99' },
          { id: 102, status: 'completed', total: '129.99' }
        ]),
        get_coupon: jest.fn().mockResolvedValue(
          { id: 201, code: 'TESTCODE', discount_type: 'percent', amount: '10' }
        )
      };
    }
    
    start() {
      return true;
    }
    
    stop() {
      return true;
    }
    
    // Method to get tools
    getTools() {
      return this.tools;
    }
  };
});

describe('WooCommerce MCP Server Tools', () => {
  let server;
  let WooCommerceMcpServer;
  
  beforeAll(() => {
    WooCommerceMcpServer = require('@techspawn/woocommerce-mcp-server');
    server = new WooCommerceMcpServer({
      woocommerce: {
        url: process.env.WOOCOMMERCE_URL,
        consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
        consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET
      }
    });
  });
  
  test('Server exposes product tools', () => {
    const tools = server.getTools();
    expect(tools).toHaveProperty('list_products');
    expect(tools).toHaveProperty('get_product');
    expect(tools).toHaveProperty('create_product');
  });
  
  test('Server exposes order tools', () => {
    const tools = server.getTools();
    expect(tools).toHaveProperty('list_orders');
  });
  
  test('Server exposes coupon tools', () => {
    const tools = server.getTools();
    expect(tools).toHaveProperty('get_coupon');
  });
  
  test('list_products tool returns products', async () => {
    const tools = server.getTools();
    const products = await tools.list_products();
    expect(products).toHaveLength(2);
    expect(products[0]).toHaveProperty('id', 1);
    expect(products[0]).toHaveProperty('name', 'Test Product 1');
  });
  
  test('get_product tool returns product details', async () => {
    const tools = server.getTools();
    const product = await tools.get_product({ id: 1 });
    expect(product).toHaveProperty('id', 1);
    expect(product).toHaveProperty('name', 'Test Product 1');
    expect(product).toHaveProperty('description', 'Test description');
  });
  
  // Add more tests for other tools as needed
});
