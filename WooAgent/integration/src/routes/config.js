/**
 * Config Routes
 * 
 * This module defines the API routes for configuration management.
 */

const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

/**
 * @route   GET /api/config
 * @desc    Get current configuration
 * @access  Public
 */
router.get('/', configController.getConfig);

/**
 * @route   PUT /api/config
 * @desc    Update configuration
 * @access  Public
 */
router.put('/', configController.updateConfig);

/**
 * @route   GET /api/config/openai
 * @desc    Get OpenAI configuration
 * @access  Public
 */
router.get('/openai', configController.getOpenAIConfig);

/**
 * @route   PUT /api/config/openai
 * @desc    Update OpenAI configuration
 * @access  Public
 */
router.put('/openai', configController.updateOpenAIConfig);

/**
 * @route   GET /api/config/woocommerce
 * @desc    Get WooCommerce configuration
 * @access  Public
 */
router.get('/woocommerce', configController.getWooCommerceConfig);

/**
 * @route   PUT /api/config/woocommerce
 * @desc    Update WooCommerce configuration
 * @access  Public
 */
router.put('/woocommerce', configController.updateWooCommerceConfig);

module.exports = router;
