/**
 * Logs Routes
 * 
 * This module defines the API routes for log retrieval.
 */

const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');

/**
 * @route   GET /api/logs
 * @desc    Get recent logs
 * @access  Public
 */
router.get('/', logsController.getLogs);

/**
 * @route   GET /api/logs/agent
 * @desc    Get agent logs
 * @access  Public
 */
router.get('/agent', logsController.getAgentLogs);

/**
 * @route   GET /api/logs/integration
 * @desc    Get integration layer logs
 * @access  Public
 */
router.get('/integration', logsController.getIntegrationLogs);

/**
 * @route   GET /api/logs/mcp
 * @desc    Get MCP server logs
 * @access  Public
 */
router.get('/mcp', logsController.getMcpLogs);

/**
 * @route   DELETE /api/logs
 * @desc    Clear logs
 * @access  Public
 */
router.delete('/', logsController.clearLogs);

module.exports = router;
