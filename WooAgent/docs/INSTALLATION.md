# WooAgent Installation Guide

This guide will walk you through the process of setting up and running the WooAgent system.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or later)
- **Python** (v3.9 or later)
- **npm** (usually comes with Node.js)
- **pip** (Python package manager)
- **Git** (for cloning the repository)

You will also need:

- An **OpenAI API key** with access to GPT-4
- A **WooCommerce store** with REST API access (consumer key and secret)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wooagent.git
cd wooagent
```

### 2. Set Up the Agent (Python)

```bash
cd agent
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `agent` directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key
MCP_SERVER_URL=http://localhost:3000
LOG_LEVEL=INFO
```

### 3. Set Up the MCP Server

```bash
cd ../mcp-server
npm install
```

Create a `.env` file in the `mcp-server` directory with the following content:

```
WOOCOMMERCE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
PORT=3000
```

### 4. Set Up the Integration Layer

```bash
cd ../integration
npm install
```

Create a `.env` file in the `integration` directory with the following content:

```
AGENT_API_URL=http://localhost:5000
PORT=4000
```

### 5. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Running the Application

You need to start each component in a separate terminal window.

### 1. Start the MCP Server

```bash
cd mcp-server
npm start
```

The MCP server should start on port 3000.

### 2. Start the Agent

```bash
cd agent
# Activate the virtual environment if not already activated
python -m src.main
```

The agent should start on port 5000.

### 3. Start the Integration Layer

```bash
cd integration
npm start
```

The integration layer should start on port 4000.

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend should start on port 3001. You can access it at http://localhost:3001

## Verifying the Installation

1. Open your browser and navigate to http://localhost:3001
2. You should see the WooAgent dashboard
3. Go to the Settings page and verify that your OpenAI and WooCommerce credentials are properly configured
4. Navigate to the Chat page and try sending a message like "Show me a list of products"

## Troubleshooting

### Agent Not Connecting to MCP Server

- Check that the MCP server is running on the correct port
- Verify that the `MCP_SERVER_URL` in the agent's `.env` file is correct
- Check the agent logs for any connection errors

### Integration Layer Not Connecting to Agent

- Ensure the agent is running on the correct port
- Verify that the `AGENT_API_URL` in the integration layer's `.env` file is correct
- Check the integration logs for any connection errors

### Frontend Not Connecting to Integration Layer

- Make sure the integration layer is running on the correct port
- Verify that the `NEXT_PUBLIC_API_URL` in the frontend's `.env.local` file is correct
- Check the browser console for any connection errors

### WooCommerce API Connection Issues

- Verify that your WooCommerce store is accessible
- Check that the consumer key and secret are correct
- Ensure that the REST API is enabled in your WooCommerce settings

## Running Tests

### End-to-End Tests

```bash
cd tests
npm install
npm run e2e
```

This will run a series of end-to-end tests to verify that the entire system is working correctly.

## Next Steps

After successful installation, you may want to:

1. Customize the system prompt in `agent/src/services/agent_service.py`
2. Add more test scenarios in `tests/e2e_test.js`
3. Customize the frontend theme in `frontend/src/pages/_app.js`

For more information, refer to the [User Guide](./USER_GUIDE.md) and [API Documentation](./API_DOCS.md).
