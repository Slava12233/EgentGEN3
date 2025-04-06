/**
 * End-to-End Test Script for WooAgent
 * 
 * This script tests the complete workflow from user input to WooCommerce action.
 * It verifies conversation memory, context handling, and error scenarios.
 */

const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:4000';
const DELAY_BETWEEN_TESTS = 1000; // 1 second

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test scenarios
const testScenarios = [
  {
    name: 'Basic Product Listing',
    description: 'Test listing products from the store',
    messages: [
      'Show me a list of products in the store'
    ],
    expectedToolCalls: ['list_products'],
    validation: (response) => {
      return response.includes('product') || response.includes('products');
    }
  },
  {
    name: 'Product Details',
    description: 'Test getting details for a specific product',
    messages: [
      'Show me details for the first product'
    ],
    expectedToolCalls: ['get_product'],
    validation: (response) => {
      return response.includes('price') || response.includes('description') || response.includes('stock');
    }
  },
  {
    name: 'Conversation Memory',
    description: 'Test if the agent remembers previous context',
    messages: [
      'Show me a list of products',
      'Tell me more about the first one',
      'What is its price?'
    ],
    expectedToolCalls: ['list_products', 'get_product'],
    validation: (response) => {
      return response.includes('price') || response.includes('$') || response.includes('costs');
    }
  },
  {
    name: 'Order Listing',
    description: 'Test listing orders from the store',
    messages: [
      'Show me recent orders'
    ],
    expectedToolCalls: ['list_orders'],
    validation: (response) => {
      return response.includes('order') || response.includes('orders');
    }
  },
  {
    name: 'Error Handling',
    description: 'Test how the agent handles errors',
    messages: [
      'Get details for product with ID 999999' // Assuming this ID doesn't exist
    ],
    expectedToolCalls: ['get_product'],
    validation: (response) => {
      return response.includes('not found') || response.includes('error') || response.includes('unable to find');
    }
  }
];

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createConversation = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/chat/conversations`);
    if (response.data.success) {
      return response.data.data.conversation_id;
    } else {
      throw new Error('Failed to create conversation');
    }
  } catch (error) {
    console.error(chalk.red('Error creating conversation:'), error.message);
    throw error;
  }
};

const sendMessage = async (conversationId, message) => {
  try {
    const response = await axios.post(`${API_URL}/api/chat/message`, {
      conversationId,
      message
    });
    
    if (response.data.success) {
      return response.data.data.response;
    } else {
      throw new Error('Failed to get response from agent');
    }
  } catch (error) {
    console.error(chalk.red('Error sending message:'), error.message);
    throw error;
  }
};

const getLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/logs`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to get logs');
    }
  } catch (error) {
    console.error(chalk.red('Error getting logs:'), error.message);
    throw error;
  }
};

// Main test function
const runTests = async () => {
  console.log(chalk.blue('=== WooAgent End-to-End Tests ==='));
  console.log(chalk.blue('Testing API at:'), API_URL);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const scenario of testScenarios) {
    console.log(chalk.yellow(`\n[Test] ${scenario.name}: ${scenario.description}`));
    
    try {
      // Create a new conversation for each test
      const conversationId = await createConversation();
      console.log(chalk.gray(`Created conversation: ${conversationId}`));
      
      let finalResponse = '';
      
      // Send all messages in the scenario
      for (const message of scenario.messages) {
        console.log(chalk.cyan(`User: ${message}`));
        
        // Send message and get response
        const response = await sendMessage(conversationId, message);
        finalResponse = response;
        
        console.log(chalk.green(`Agent: ${response}`));
        
        // Add a small delay between messages
        await delay(500);
      }
      
      // Validate the response
      const isValid = scenario.validation(finalResponse);
      
      if (isValid) {
        console.log(chalk.green(`✓ Test passed: ${scenario.name}`));
        passedTests++;
      } else {
        console.log(chalk.red(`✗ Test failed: ${scenario.name}`));
        console.log(chalk.red('  Response did not meet validation criteria'));
        failedTests++;
      }
      
      // Add delay between tests
      await delay(DELAY_BETWEEN_TESTS);
      
    } catch (error) {
      console.log(chalk.red(`✗ Test failed: ${scenario.name}`));
      console.log(chalk.red(`  Error: ${error.message}`));
      failedTests++;
    }
  }
  
  // Print test summary
  console.log(chalk.blue('\n=== Test Summary ==='));
  console.log(chalk.green(`Passed: ${passedTests}`));
  console.log(chalk.red(`Failed: ${failedTests}`));
  console.log(chalk.blue(`Total: ${testScenarios.length}`));
  
  // Ask if user wants to see logs
  rl.question(chalk.yellow('\nDo you want to see the logs? (y/n) '), async (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        const logs = await getLogs();
        console.log(chalk.blue('\n=== Agent Logs ==='));
        logs.agent.slice(-10).forEach(log => {
          console.log(chalk.gray(`[${new Date(log.timestamp).toLocaleString()}]`), log.message);
        });
      } catch (error) {
        console.error(chalk.red('Failed to fetch logs'));
      }
    }
    
    rl.close();
  });
};

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('Test execution failed:'), error);
  rl.close();
});
