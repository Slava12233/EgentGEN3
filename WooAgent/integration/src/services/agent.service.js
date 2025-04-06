/**
 * Agent Service
 * 
 * This module provides services for communicating with the Python agent.
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const configService = require('./config.service');

// Create axios instance for agent API
const agentApi = axios.create({
  baseURL: process.env.AGENT_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Send a message to the agent
 * 
 * @param {string} conversationId - Conversation ID (optional)
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Agent response
 */
exports.sendMessage = async (conversationId, message) => {
  try {
    // If no conversation ID is provided, create a new one
    if (!conversationId) {
      const newConversation = await this.createConversation();
      conversationId = newConversation.conversation_id;
    }
    
    // Send message to agent
    const response = await agentApi.post('/message', {
      conversation_id: conversationId,
      message
    });
    
    return response.data;
  } catch (error) {
    // Handle specific error types
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Agent API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Agent API is not responding. Please check if the agent is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error sending message to agent: ${error.message}`);
    }
  }
};

/**
 * Get list of conversations
 * 
 * @param {number} limit - Maximum number of conversations to return
 * @returns {Promise<Array>} - List of conversations
 */
exports.getConversations = async (limit = 10) => {
  try {
    const response = await agentApi.get('/conversations', {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Agent API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Agent API is not responding. Please check if the agent is running.');
    } else {
      throw new Error(`Error getting conversations: ${error.message}`);
    }
  }
};

/**
 * Get a specific conversation
 * 
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Conversation details
 */
exports.getConversation = async (conversationId) => {
  try {
    const response = await agentApi.get(`/conversations/${conversationId}`);
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Conversation not found
    } else if (error.response) {
      throw new Error(`Agent API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Agent API is not responding. Please check if the agent is running.');
    } else {
      throw new Error(`Error getting conversation: ${error.message}`);
    }
  }
};

/**
 * Create a new conversation
 * 
 * @param {Object} metadata - Optional metadata for the conversation
 * @returns {Promise<Object>} - New conversation details
 */
exports.createConversation = async (metadata = {}) => {
  try {
    const response = await agentApi.post('/conversations', { metadata });
    
    return response.data;
  } catch (error) {
    // If the agent API is not available, create a temporary conversation ID
    // This allows the frontend to work even if the agent is not running
    if (error.request) {
      return {
        conversation_id: uuidv4(),
        created_at: new Date().toISOString(),
        _temporary: true
      };
    }
    
    if (error.response) {
      throw new Error(`Agent API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else {
      throw new Error(`Error creating conversation: ${error.message}`);
    }
  }
};

/**
 * Check if the agent is running
 * 
 * @returns {Promise<boolean>} - True if the agent is running
 */
exports.isAgentRunning = async () => {
  try {
    await agentApi.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Restart the agent
 * 
 * @returns {Promise<boolean>} - True if the agent was restarted successfully
 */
exports.restartAgent = async () => {
  try {
    // Get the current configuration
    const config = await configService.getConfig();
    
    // Send restart command to agent
    await agentApi.post('/restart', { config });
    
    return true;
  } catch (error) {
    if (error.response) {
      throw new Error(`Agent API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Agent API is not responding. Please check if the agent is running.');
    } else {
      throw new Error(`Error restarting agent: ${error.message}`);
    }
  }
};
