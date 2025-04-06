/**
 * Logs Controller
 * 
 * This module handles log retrieval operations.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const logsService = require('../services/logs.service');

/**
 * Get recent logs
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logsService.getLogs(limit);
    
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    req.logger.error(`Error getting logs: ${error.message}`);
    next(error);
  }
};

/**
 * Get agent logs
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAgentLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logsService.getAgentLogs(limit);
    
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    req.logger.error(`Error getting agent logs: ${error.message}`);
    next(error);
  }
};

/**
 * Get integration layer logs
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getIntegrationLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logsService.getIntegrationLogs(limit);
    
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    req.logger.error(`Error getting integration logs: ${error.message}`);
    next(error);
  }
};

/**
 * Get MCP server logs
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getMcpLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logsService.getMcpLogs(limit);
    
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    req.logger.error(`Error getting MCP logs: ${error.message}`);
    next(error);
  }
};

/**
 * Clear logs
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.clearLogs = async (req, res, next) => {
  try {
    const { type } = req.query;
    
    if (type && !['agent', 'integration', 'mcp'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid log type. Must be one of: agent, integration, mcp'
      });
    }
    
    await logsService.clearLogs(type);
    
    return res.status(200).json({
      success: true,
      message: type ? `${type} logs cleared` : 'All logs cleared'
    });
  } catch (error) {
    req.logger.error(`Error clearing logs: ${error.message}`);
    next(error);
  }
};
