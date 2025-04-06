/**
 * Config Service
 * 
 * This module provides services for managing configuration.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);

// Config file path
const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Default configuration
const DEFAULT_CONFIG = {
  openai: {
    apiKey: null,
    model: 'gpt-4'
  },
  woocommerce: {
    url: null,
    consumerKey: null,
    consumerSecret: null
  },
  mcp: {
    port: 3000
  },
  agent: {
    port: 5000
  }
};

/**
 * Ensure config directory exists
 * 
 * @returns {Promise<void>}
 */
const ensureConfigDir = async () => {
  try {
    await mkdirAsync(CONFIG_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

/**
 * Get current configuration
 * 
 * @returns {Promise<Object>} - Current configuration
 */
exports.getConfig = async () => {
  try {
    await ensureConfigDir();
    
    // Check if config file exists
    try {
      const configData = await readFileAsync(CONFIG_FILE, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Config file doesn't exist, create it with default config
        await writeFileAsync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
        return DEFAULT_CONFIG;
      }
      throw error;
    }
  } catch (error) {
    throw new Error(`Error getting config: ${error.message}`);
  }
};

/**
 * Update configuration
 * 
 * @param {Object} config - New configuration
 * @returns {Promise<Object>} - Updated configuration
 */
exports.updateConfig = async (config) => {
  try {
    await ensureConfigDir();
    
    // Get current config
    const currentConfig = await this.getConfig();
    
    // Merge with new config
    const updatedConfig = {
      ...currentConfig,
      ...config
    };
    
    // Write updated config to file
    await writeFileAsync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));
    
    return updatedConfig;
  } catch (error) {
    throw new Error(`Error updating config: ${error.message}`);
  }
};

/**
 * Get OpenAI configuration
 * 
 * @returns {Promise<Object>} - OpenAI configuration
 */
exports.getOpenAIConfig = async () => {
  try {
    const config = await this.getConfig();
    return config.openai || DEFAULT_CONFIG.openai;
  } catch (error) {
    throw new Error(`Error getting OpenAI config: ${error.message}`);
  }
};

/**
 * Update OpenAI configuration
 * 
 * @param {Object} openaiConfig - New OpenAI configuration
 * @returns {Promise<Object>} - Updated OpenAI configuration
 */
exports.updateOpenAIConfig = async (openaiConfig) => {
  try {
    const config = await this.getConfig();
    
    // Merge with current OpenAI config
    const updatedOpenAIConfig = {
      ...config.openai,
      ...openaiConfig
    };
    
    // Update config
    await this.updateConfig({
      ...config,
      openai: updatedOpenAIConfig
    });
    
    return updatedOpenAIConfig;
  } catch (error) {
    throw new Error(`Error updating OpenAI config: ${error.message}`);
  }
};

/**
 * Get WooCommerce configuration
 * 
 * @returns {Promise<Object>} - WooCommerce configuration
 */
exports.getWooCommerceConfig = async () => {
  try {
    const config = await this.getConfig();
    return config.woocommerce || DEFAULT_CONFIG.woocommerce;
  } catch (error) {
    throw new Error(`Error getting WooCommerce config: ${error.message}`);
  }
};

/**
 * Update WooCommerce configuration
 * 
 * @param {Object} woocommerceConfig - New WooCommerce configuration
 * @returns {Promise<Object>} - Updated WooCommerce configuration
 */
exports.updateWooCommerceConfig = async (woocommerceConfig) => {
  try {
    const config = await this.getConfig();
    
    // Merge with current WooCommerce config
    const updatedWooCommerceConfig = {
      ...config.woocommerce,
      ...woocommerceConfig
    };
    
    // Update config
    await this.updateConfig({
      ...config,
      woocommerce: updatedWooCommerceConfig
    });
    
    return updatedWooCommerceConfig;
  } catch (error) {
    throw new Error(`Error updating WooCommerce config: ${error.message}`);
  }
};
