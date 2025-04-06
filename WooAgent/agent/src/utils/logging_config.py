"""
Logging Configuration

This module sets up logging for the WooAgent application.
"""

import os
import logging
import sys
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

def setup_logging():
    """
    Configure logging for the application.
    
    Returns:
        logging.Logger: Configured logger instance
    """
    # Load environment variables if not already loaded
    load_dotenv()
    
    # Get log level from environment or default to INFO
    log_level_name = os.getenv('LOG_LEVEL', 'INFO').upper()
    log_level = getattr(logging, log_level_name, logging.INFO)
    
    # Get log file path from environment or default to agent.log
    log_file = os.getenv('LOG_FILE', 'agent.log')
    
    # Create logger
    logger = logging.getLogger('wooagent')
    logger.setLevel(log_level)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    
    # Create file handler
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    
    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger
