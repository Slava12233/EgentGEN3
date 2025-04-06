/**
 * Config Controller
 * 
 * This module handles configuration-related operations.
 */

const configService = require('../services/config.service');

/**
 * Get current configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getConfig = async (req, res, next) => {
  try {
    const config = await configService.getConfig();
    
    // Remove sensitive information
    const safeConfig = {
      ...config,
      openai: config.openai ? {
        ...config.openai,
        apiKey: config.openai.apiKey ? '********' : null
      } : null,
      woocommerce: config.woocommerce ? {
        ...config.woocommerce,
        consumerKey: config.woocommerce.consumerKey ? '********' : null,
        consumerSecret: config.woocommerce.consumerSecret ? '********' : null
      } : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error getting config: ${error.message}`);
    next(error);
  }
};

/**
 * Update configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateConfig = async (req, res, next) => {
  try {
    const config = req.body;
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Configuration is required'
      });
    }
    
    const updatedConfig = await configService.updateConfig(config);
    
    // Remove sensitive information
    const safeConfig = {
      ...updatedConfig,
      openai: updatedConfig.openai ? {
        ...updatedConfig.openai,
        apiKey: updatedConfig.openai.apiKey ? '********' : null
      } : null,
      woocommerce: updatedConfig.woocommerce ? {
        ...updatedConfig.woocommerce,
        consumerKey: updatedConfig.woocommerce.consumerKey ? '********' : null,
        consumerSecret: updatedConfig.woocommerce.consumerSecret ? '********' : null
      } : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error updating config: ${error.message}`);
    next(error);
  }
};

/**
 * Get OpenAI configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getOpenAIConfig = async (req, res, next) => {
  try {
    const config = await configService.getOpenAIConfig();
    
    // Remove sensitive information
    const safeConfig = {
      ...config,
      apiKey: config.apiKey ? '********' : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error getting OpenAI config: ${error.message}`);
    next(error);
  }
};

/**
 * Update OpenAI configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateOpenAIConfig = async (req, res, next) => {
  try {
    const config = req.body;
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Configuration is required'
      });
    }
    
    const updatedConfig = await configService.updateOpenAIConfig(config);
    
    // Remove sensitive information
    const safeConfig = {
      ...updatedConfig,
      apiKey: updatedConfig.apiKey ? '********' : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error updating OpenAI config: ${error.message}`);
    next(error);
  }
};

/**
 * Get WooCommerce configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getWooCommerceConfig = async (req, res, next) => {
  try {
    const config = await configService.getWooCommerceConfig();
    
    // Remove sensitive information
    const safeConfig = {
      ...config,
      consumerKey: config.consumerKey ? '********' : null,
      consumerSecret: config.consumerSecret ? '********' : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error getting WooCommerce config: ${error.message}`);
    next(error);
  }
};

/**
 * Update WooCommerce configuration
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateWooCommerceConfig = async (req, res, next) => {
  try {
    const config = req.body;
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Configuration is required'
      });
    }
    
    const updatedConfig = await configService.updateWooCommerceConfig(config);
    
    // Remove sensitive information
    const safeConfig = {
      ...updatedConfig,
      consumerKey: updatedConfig.consumerKey ? '********' : null,
      consumerSecret: updatedConfig.consumerSecret ? '********' : null
    };
    
    return res.status(200).json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    req.logger.error(`Error updating WooCommerce config: ${error.message}`);
    next(error);
  }
};
