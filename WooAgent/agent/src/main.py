"""
WooAgent - Main Entry Point

This module initializes and runs the WooCommerce AI agent.
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Configure logging
from utils.logging_config import setup_logging
logger = setup_logging()

# Import services
from services.agent_service import AgentService

def main():
    """
    Main entry point for the WooAgent application.
    """
    # Load environment variables
    load_dotenv()
    
    # Check for required environment variables
    required_env_vars = ['OPENAI_API_KEY', 'MCP_SERVER_URL']
    missing_env_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_env_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_env_vars)}")
        logger.error("Please set these variables in your .env file")
        return 1
    
    try:
        # Initialize the agent service
        agent_service = AgentService(
            openai_api_key=os.getenv('OPENAI_API_KEY'),
            mcp_server_url=os.getenv('MCP_SERVER_URL')
        )
        logger.info("Agent service initialized successfully")
        
        # Create a new conversation
        conversation = agent_service.create_new_conversation()
        conversation_id = conversation['conversation_id']
        logger.info(f"Created new conversation with ID: {conversation_id}")
        
        # For demonstration purposes, we'll process a simple request
        message = "List the first 5 products in the store"
        logger.info(f"Sending message: {message}")
        
        response = agent_service.process_message(conversation_id, message)
        
        if response['success']:
            logger.info(f"Agent response: {response['response']}")
        else:
            logger.error(f"Error: {response.get('error', 'Unknown error')}")
            return 1
        
        return 0
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
