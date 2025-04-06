/**
 * Chat Routes
 * 
 * This module defines the API routes for chat functionality.
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

/**
 * @route   POST /api/chat/message
 * @desc    Send a message to the agent
 * @access  Public
 */
router.post('/message', chatController.sendMessage);

/**
 * @route   GET /api/chat/conversations
 * @desc    Get list of conversations
 * @access  Public
 */
router.get('/conversations', chatController.getConversations);

/**
 * @route   GET /api/chat/conversations/:id
 * @desc    Get a specific conversation
 * @access  Public
 */
router.get('/conversations/:id', chatController.getConversation);

/**
 * @route   POST /api/chat/conversations
 * @desc    Create a new conversation
 * @access  Public
 */
router.post('/conversations', chatController.createConversation);

module.exports = router;
