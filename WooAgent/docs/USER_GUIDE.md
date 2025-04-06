# WooAgent User Guide

This guide will help you understand how to use the WooAgent system to manage your WooCommerce store through natural language conversations.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Chat Interface](#chat-interface)
5. [Settings](#settings)
6. [Logs](#logs)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

## Introduction

WooAgent is an AI-powered assistant that helps you manage your WooCommerce store through natural language conversations. It can help you with various tasks such as:

- Viewing and managing products
- Checking and updating inventory
- Managing orders
- Creating and applying coupons
- And much more!

The agent uses OpenAI's GPT models to understand your requests and convert them into actions on your WooCommerce store.

## Getting Started

After [installing](./INSTALLATION.md) the WooAgent system, you need to configure it to connect to your WooCommerce store and OpenAI account.

1. Open the WooAgent dashboard in your browser (typically at http://localhost:3001)
2. Navigate to the Settings page
3. Configure your OpenAI API key
4. Configure your WooCommerce store URL and API credentials
5. Test the connection to ensure everything is working properly

## Dashboard

The dashboard provides an overview of your WooAgent system:

- **Status Cards**: Show the current status of the Agent, Integration Layer, and MCP Server
- **Quick Actions**: Provide shortcuts to common tasks
- **Recent Conversations**: Display your recent conversations with the agent

From the dashboard, you can quickly navigate to other sections of the application using the sidebar menu.

## Chat Interface

The chat interface is where you interact with the WooAgent. Here's how to use it:

1. Navigate to the Chat page from the sidebar menu
2. Type your request in the input field at the bottom of the page
3. Press Enter or click the Send button to send your message
4. The agent will process your request and respond with the appropriate information or action

### Example Requests

Here are some examples of requests you can make:

- "Show me a list of all products in the store"
- "How many units of Product X do we have in stock?"
- "Update the price of Product Y to $29.99"
- "Show me all orders from the last week"
- "Create a new coupon for 20% off that expires in 30 days"

The agent will understand your intent and perform the appropriate action on your WooCommerce store.

## Settings

The Settings page allows you to configure the WooAgent system:

### OpenAI Settings

- **API Key**: Your OpenAI API key
- **Model**: The GPT model to use (GPT-4 recommended for best results)

### WooCommerce Settings

- **Store URL**: The URL of your WooCommerce store
- **Consumer Key**: Your WooCommerce API consumer key
- **Consumer Secret**: Your WooCommerce API consumer secret

After making changes to the settings, click the "Save Settings" button to apply them. You may need to restart the agent for some changes to take effect.

## Logs

The Logs page allows you to view the system logs, which can be helpful for troubleshooting:

- **Agent Logs**: Logs from the Python agent
- **Integration Logs**: Logs from the Node.js integration layer
- **MCP Logs**: Logs from the MCP server that connects to WooCommerce

You can filter the logs by type and refresh them to see the latest entries.

## Common Tasks

### Managing Products

#### Viewing Products

- "Show me all products"
- "List products in the 'Clothing' category"
- "Show me products with low stock"

#### Product Details

- "Tell me about product X"
- "What's the price of product Y?"
- "How many units of product Z do we have in stock?"

#### Creating Products

- "Create a new product called 'Summer T-Shirt' with price $24.99"
- "Add a new product in the 'Electronics' category"

#### Updating Products

- "Update the price of product X to $29.99"
- "Set the stock quantity of product Y to 50"
- "Mark product Z as featured"

### Managing Orders

#### Viewing Orders

- "Show me recent orders"
- "List orders from the last week"
- "Show me orders with status 'Processing'"

#### Order Details

- "Tell me about order #1234"
- "What items are in order #5678?"

#### Updating Orders

- "Mark order #1234 as completed"
- "Update the status of order #5678 to 'Processing'"

### Managing Coupons

#### Viewing Coupons

- "Show me all active coupons"
- "List coupons that expire this month"

#### Creating Coupons

- "Create a coupon for 20% off all products"
- "Add a new coupon 'SUMMER2025' for $10 off orders over $50"

#### Updating Coupons

- "Update coupon 'WINTER2024' to expire on December 31"
- "Change the discount of coupon 'SALE' to 30%"

## Troubleshooting

### Agent Not Responding

If the agent is not responding to your messages:

1. Check the status indicators on the dashboard to ensure all components are running
2. Check the logs for any error messages
3. Try restarting the agent from the Settings page

### Incorrect Responses

If the agent is not understanding your requests correctly:

1. Try rephrasing your request to be more specific
2. Check the logs to see how the agent interpreted your request
3. Provide more context in your message

### Connection Issues

If you're experiencing connection issues:

1. Check that all components (MCP Server, Agent, Integration Layer) are running
2. Verify your WooCommerce API credentials in the Settings page
3. Test the connection to your WooCommerce store

For more detailed troubleshooting, refer to the [Installation Guide](./INSTALLATION.md#troubleshooting).

## Additional Resources

- [API Documentation](./API_DOCS.md): Details about the API endpoints
- [Installation Guide](./INSTALLATION.md): Instructions for installing and setting up WooAgent
- [GitHub Repository](https://github.com/yourusername/wooagent): Source code and issue tracker
