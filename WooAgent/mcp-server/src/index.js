/**
 * WooAgent MCP Server
 * 
 * This script initializes and starts a WooCommerce API server
 * with configuration from environment variables.
 */

// Load environment variables
require('dotenv').config();

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// Define API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const response = await woocommerce.get('products', req.query);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const response = await woocommerce.get(`products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const response = await woocommerce.post('products', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const response = await woocommerce.put(`products/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const response = await woocommerce.get('orders', req.query);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const response = await woocommerce.get(`orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching order ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const response = await woocommerce.put(`orders/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(`Error updating order ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const response = await woocommerce.get('coupons', req.query);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const response = await woocommerce.post('coupons', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
console.log('Starting WooCommerce API Server...');
console.log(`WooCommerce URL: ${process.env.WOOCOMMERCE_URL}`);
console.log(`Server port: ${PORT}`);

app.listen(PORT, () => {
  console.log(`WooCommerce API Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WooCommerce API Server...');
  process.exit(0);
});
