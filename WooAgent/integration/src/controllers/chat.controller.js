/**
 * Chat Controller
 * 
 * This module handles chat-related operations.
 */

const axios = require('axios');
const agentService = require('../services/agent.service');

/**
 * Send a message to the agent
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    const response = await agentService.sendMessage(conversationId, message);
    
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    req.logger.error(`Error sending message: ${error.message}`);
    
    // Handle specific error types
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    next(error);
  }
};

/**
 * Get list of conversations
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getConversations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const conversations = await agentService.getConversations(limit);
    
    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    req.logger.error(`Error getting conversations: ${error.message}`);
    next(error);
  }
};

/**
 * Get a specific conversation
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }
    
    const conversation = await agentService.getConversation(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    req.logger.error(`Error getting conversation: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new conversation
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createConversation = async (req, res, next) => {
  try {
    const metadata = req.body.metadata || {};
    const conversation = await agentService.createConversation(metadata);
    
    return res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    req.logger.error(`Error creating conversation: ${error.message}`);
    next(error);
  }
};
