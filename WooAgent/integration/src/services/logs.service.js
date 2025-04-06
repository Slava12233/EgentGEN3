/**
 * Logs Service
 * 
 * This module provides services for retrieving and managing logs.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const accessAsync = promisify(fs.access);

// Log file paths
const INTEGRATION_LOG_FILE = path.join(process.cwd(), 'integration.log');
const AGENT_LOG_FILE = path.join(process.cwd(), '..', 'agent', 'agent.log');
const MCP_LOG_FILE = path.join(process.cwd(), '..', 'mcp-server', 'mcp-server.log');

/**
 * Check if a file exists
 * 
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if the file exists
 */
const fileExists = async (filePath) => {
  try {
    await accessAsync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Read log file
 * 
 * @param {string} filePath - Path to the log file
 * @param {number} limit - Maximum number of lines to return
 * @returns {Promise<Array>} - Log entries
 */
const readLogFile = async (filePath, limit) => {
  try {
    // Check if file exists
    const exists = await fileExists(filePath);
    if (!exists) {
      return [];
    }
    
    // Read file
    const data = await readFileAsync(filePath, 'utf8');
    
    // Parse log entries
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Parse JSON entries if possible
    const entries = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return { message: line, timestamp: new Date().toISOString() };
      }
    });
    
    // Return the most recent entries
    return entries.slice(-limit);
  } catch (error) {
    throw new Error(`Error reading log file ${filePath}: ${error.message}`);
  }
};

/**
 * Clear log file
 * 
 * @param {string} filePath - Path to the log file
 * @returns {Promise<void>}
 */
const clearLogFile = async (filePath) => {
  try {
    // Check if file exists
    const exists = await fileExists(filePath);
    if (!exists) {
      return;
    }
    
    // Clear file
    await writeFileAsync(filePath, '');
  } catch (error) {
    throw new Error(`Error clearing log file ${filePath}: ${error.message}`);
  }
};

/**
 * Get all logs
 * 
 * @param {number} limit - Maximum number of log entries to return
 * @returns {Promise<Object>} - Log entries by type
 */
exports.getLogs = async (limit = 100) => {
  try {
    // Get logs from all sources
    const [agentLogs, integrationLogs, mcpLogs] = await Promise.all([
      this.getAgentLogs(limit),
      this.getIntegrationLogs(limit),
      this.getMcpLogs(limit)
    ]);
    
    return {
      agent: agentLogs,
      integration: integrationLogs,
      mcp: mcpLogs
    };
  } catch (error) {
    throw new Error(`Error getting logs: ${error.message}`);
  }
};

/**
 * Get agent logs
 * 
 * @param {number} limit - Maximum number of log entries to return
 * @returns {Promise<Array>} - Agent log entries
 */
exports.getAgentLogs = async (limit = 100) => {
  try {
    return await readLogFile(AGENT_LOG_FILE, limit);
  } catch (error) {
    throw new Error(`Error getting agent logs: ${error.message}`);
  }
};

/**
 * Get integration logs
 * 
 * @param {number} limit - Maximum number of log entries to return
 * @returns {Promise<Array>} - Integration log entries
 */
exports.getIntegrationLogs = async (limit = 100) => {
  try {
    return await readLogFile(INTEGRATION_LOG_FILE, limit);
  } catch (error) {
    throw new Error(`Error getting integration logs: ${error.message}`);
  }
};

/**
 * Get MCP server logs
 * 
 * @param {number} limit - Maximum number of log entries to return
 * @returns {Promise<Array>} - MCP server log entries
 */
exports.getMcpLogs = async (limit = 100) => {
  try {
    return await readLogFile(MCP_LOG_FILE, limit);
  } catch (error) {
    throw new Error(`Error getting MCP logs: ${error.message}`);
  }
};

/**
 * Clear logs
 * 
 * @param {string} type - Log type to clear (agent, integration, mcp, or all if not specified)
 * @returns {Promise<void>}
 */
exports.clearLogs = async (type) => {
  try {
    if (!type || type === 'agent') {
      await clearLogFile(AGENT_LOG_FILE);
    }
    
    if (!type || type === 'integration') {
      await clearLogFile(INTEGRATION_LOG_FILE);
    }
    
    if (!type || type === 'mcp') {
      await clearLogFile(MCP_LOG_FILE);
    }
  } catch (error) {
    throw new Error(`Error clearing logs: ${error.message}`);
  }
};
