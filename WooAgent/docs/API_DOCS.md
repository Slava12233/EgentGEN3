# WooAgent API Documentation

This document provides detailed information about the API endpoints available in the WooAgent system.

## Base URL

All API endpoints are relative to the base URL of the integration layer:

```
http://localhost:4000/api
```

## Authentication

Currently, the API does not require authentication for local development. In a production environment, you would want to implement proper authentication.

## Response Format

All API responses follow a standard format:

```json
{
  "success": true|false,
  "data": { ... },  // Present on successful requests
  "message": "..."  // Present on failed requests
}
```

## Endpoints

### Health

#### GET /health

Check if the integration layer is running.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-04-07T01:30:00.000Z"
  }
}
```

#### GET /health/agent

Check if the agent is running.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2025-04-07T01:30:00.000Z"
  }
}
```

#### GET /health/mcp

Check if the MCP server is running.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2025-04-07T01:30:00.000Z"
  }
}
```

### Chat

#### POST /chat/conversations

Create a new conversation.

**Request Body:**

```json
{
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

The `metadata` field is optional and can contain any additional information you want to associate with the conversation.

**Response:**

```json
{
  "success": true,
  "data": {
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-04-07T01:30:00.000Z"
  }
}
```

#### GET /chat/conversations

Get a list of recent conversations.

**Query Parameters:**

- `limit` (optional): Maximum number of conversations to return (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2025-04-07T01:30:00.000Z",
      "updated_at": "2025-04-07T01:35:00.000Z",
      "message_count": 5,
      "metadata": { ... }
    },
    ...
  ]
}
```

#### GET /chat/conversations/:id

Get details of a specific conversation.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-04-07T01:30:00.000Z",
    "updated_at": "2025-04-07T01:35:00.000Z",
    "messages": [
      {
        "role": "user",
        "content": "Show me all products",
        "timestamp": "2025-04-07T01:30:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Here are all the products in your store: ...",
        "timestamp": "2025-04-07T01:30:05.000Z"
      },
      ...
    ],
    "metadata": { ... }
  }
}
```

#### POST /chat/message

Send a message to the agent.

**Request Body:**

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Show me all products"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "response": "Here are all the products in your store: ..."
  }
}
```

### Configuration

#### GET /config

Get the current configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "openai": {
      "model": "gpt-4"
    },
    "woocommerce": {
      "url": "https://example.com"
    },
    "mcp": {
      "port": 3000
    },
    "agent": {
      "port": 5000
    }
  }
}
```

Note that sensitive information like API keys and secrets are not returned.

#### GET /config/openai

Get the OpenAI configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "apiKey": "********",
    "model": "gpt-4"
  }
}
```

#### PUT /config/openai

Update the OpenAI configuration.

**Request Body:**

```json
{
  "apiKey": "your_openai_api_key",
  "model": "gpt-4"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "apiKey": "********",
    "model": "gpt-4"
  }
}
```

#### GET /config/woocommerce

Get the WooCommerce configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "consumerKey": "********",
    "consumerSecret": "********"
  }
}
```

#### PUT /config/woocommerce

Update the WooCommerce configuration.

**Request Body:**

```json
{
  "url": "https://example.com",
  "consumerKey": "your_consumer_key",
  "consumerSecret": "your_consumer_secret"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "consumerKey": "********",
    "consumerSecret": "********"
  }
}
```

#### POST /config/woocommerce/test

Test the WooCommerce connection.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "connected",
    "store_info": {
      "name": "Example Store",
      "url": "https://example.com",
      "version": "7.5.0"
    }
  }
}
```

### Logs

#### GET /logs

Get all logs.

**Query Parameters:**

- `limit` (optional): Maximum number of log entries to return (default: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "agent": [
      {
        "timestamp": "2025-04-07T01:30:00.000Z",
        "level": "info",
        "message": "Agent initialized"
      },
      ...
    ],
    "integration": [
      {
        "timestamp": "2025-04-07T01:29:55.000Z",
        "level": "info",
        "message": "Server started on port 4000"
      },
      ...
    ],
    "mcp": [
      {
        "timestamp": "2025-04-07T01:29:50.000Z",
        "level": "info",
        "message": "MCP server started on port 3000"
      },
      ...
    ]
  }
}
```

#### GET /logs/agent

Get agent logs.

**Query Parameters:**

- `limit` (optional): Maximum number of log entries to return (default: 100)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-04-07T01:30:00.000Z",
      "level": "info",
      "message": "Agent initialized"
    },
    ...
  ]
}
```

#### GET /logs/integration

Get integration logs.

**Query Parameters:**

- `limit` (optional): Maximum number of log entries to return (default: 100)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-04-07T01:29:55.000Z",
      "level": "info",
      "message": "Server started on port 4000"
    },
    ...
  ]
}
```

#### GET /logs/mcp

Get MCP server logs.

**Query Parameters:**

- `limit` (optional): Maximum number of log entries to return (default: 100)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-04-07T01:29:50.000Z",
      "level": "info",
      "message": "MCP server started on port 3000"
    },
    ...
  ]
}
```

#### DELETE /logs

Clear logs.

**Query Parameters:**

- `type` (optional): Type of logs to clear (agent, integration, mcp). If not specified, all logs will be cleared.

**Response:**

```json
{
  "success": true,
  "message": "Logs cleared successfully"
}
```

### Agent

#### POST /agent/restart

Restart the agent.

**Response:**

```json
{
  "success": true,
  "message": "Agent restarted successfully"
}
```

### MCP

#### POST /mcp/restart

Restart the MCP server.

**Response:**

```json
{
  "success": true,
  "message": "MCP server restarted successfully"
}
```

## Error Responses

When an error occurs, the API will return a response with `success: false` and a message explaining the error:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error status codes:

- `400 Bad Request`: The request was invalid or cannot be served
- `404 Not Found`: The requested resource does not exist
- `500 Internal Server Error`: An error occurred on the server

## Websocket API

In addition to the REST API, the integration layer also provides a WebSocket API for real-time updates. This is particularly useful for monitoring the agent's status and receiving log updates.

### Connection

Connect to the WebSocket server at:

```
ws://localhost:4000/ws
```

### Events

The WebSocket server emits the following events:

#### agent_status

Emitted when the agent's status changes.

```json
{
  "type": "agent_status",
  "data": {
    "status": "online|offline",
    "timestamp": "2025-04-07T01:30:00.000Z"
  }
}
```

#### mcp_status

Emitted when the MCP server's status changes.

```json
{
  "type": "mcp_status",
  "data": {
    "status": "online|offline",
    "timestamp": "2025-04-07T01:30:00.000Z"
  }
}
```

#### log

Emitted when a new log entry is created.

```json
{
  "type": "log",
  "data": {
    "source": "agent|integration|mcp",
    "timestamp": "2025-04-07T01:30:00.000Z",
    "level": "info|warning|error",
    "message": "Log message here"
  }
}
```

## Rate Limiting

Currently, there are no rate limits on the API. However, in a production environment, you would want to implement rate limiting to prevent abuse.

## Versioning

The API is currently at version 1. The version is not included in the URL, but future versions may include it (e.g., `/api/v2/...`).

## Further Help

If you need further assistance with the API, please refer to the [User Guide](./USER_GUIDE.md) or contact the development team.
