"""
Agent Service

This module provides services for managing the AI agent.
"""

import os
import logging
from typing import Dict, Any, Optional, List
from openai import OpenAI
from openai_agents import Agent, MCPTool

from models.conversation import Conversation
from services.conversation_service import ConversationService

logger = logging.getLogger('wooagent')

class AgentService:
    """
    Service for managing the AI agent.
    """
    
    def __init__(self, openai_api_key: str, mcp_server_url: str):
        """
        Initialize the agent service.
        
        Args:
            openai_api_key (str): OpenAI API key
            mcp_server_url (str): URL of the MCP server
        """
        self.openai_api_key = openai_api_key
        self.mcp_server_url = mcp_server_url
        self.openai_client = OpenAI(api_key=openai_api_key)
        self.agent = None
        self.conversation_service = ConversationService()
        
        # Initialize the agent
        self._initialize_agent()
    
    def _initialize_agent(self):
        """
        Initialize the OpenAI agent with tools.
        """
        try:
            # Create the agent
            self.agent = Agent(
                client=self.openai_client,
                model="gpt-4",
                tools=[]
            )
            
            # Connect to MCP server
            woocommerce_tool = MCPTool("WooCommerceTools", server_url=self.mcp_server_url)
            self.agent.register_tool(woocommerce_tool)
            
            # Set system prompt
            system_prompt = """
            You are WooAgent, an AI assistant specialized in managing WooCommerce stores.
            You can help with various tasks related to products, orders, customers, coupons, and other WooCommerce features.
            
            When asked about store information or to perform actions, use the appropriate WooCommerce tools.
            Always try to understand the user's intent and use the most appropriate tool for the job.
            
            IMPORTANT GUIDELINES:
            1. Always verify information before making changes to the store.
            2. When creating or updating products, confirm important details with the user.
            3. For critical operations like deleting items or processing refunds, ask for confirmation.
            4. Maintain context throughout the conversation and refer back to previous items discussed.
            5. Provide clear, concise responses focusing on the requested information.
            
            EXAMPLES OF TASKS:
            
            Products:
            - "Show me all products in the store" → Use list_products tool
            - "Create a new t-shirt product priced at $25" → Use create_product with appropriate parameters
            - "Update the stock of Product X to 50 units" → Use update_product_stock
            - "What's the current price of Product Y?" → Use get_product to retrieve information
            
            Orders:
            - "Show me recent orders" → Use list_orders
            - "Get details for order #1234" → Use get_order
            - "Update order #1234 status to completed" → Use update_order
            - "Process a refund for order #1234" → Use create_order_refund
            
            Customers:
            - "Show me a list of customers" → Use list_customers
            - "Get details for customer with email example@email.com" → Use get_customer
            - "Create a new customer account" → Use create_customer
            
            Coupons:
            - "Create a 20% off coupon valid for 30 days" → Use create_coupon
            - "List all active coupons" → Use list_coupons
            - "Delete coupon SUMMER2025" → Use delete_coupon
            
            Always respond in a helpful, professional manner and focus on providing the specific information or action the user requested.
            """
            
            self.agent.set_system_prompt(system_prompt)
            logger.info("Agent initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize agent: {str(e)}")
            raise
    
    def process_message(self, conversation_id: str, message: str) -> Dict[str, Any]:
        """
        Process a user message and get a response from the agent.
        
        Args:
            conversation_id (str): ID of the conversation
            message (str): User message
            
        Returns:
            Dict[str, Any]: Response containing the agent's reply and metadata
        """
        # Get or create conversation
        conversation = self.conversation_service.get_conversation(conversation_id)
        if not conversation:
            conversation = self.conversation_service.create_conversation()
        
        # Add user message to conversation
        self.conversation_service.add_message(conversation.id, 'user', message)
        
        try:
            # Get conversation context
            context = conversation.get_messages_for_context()
            
            # Process with agent
            response = self.agent.run(message, context=context)
            
            # Add assistant message to conversation
            self.conversation_service.add_message(conversation.id, 'assistant', response)
            
            return {
                'conversation_id': conversation.id,
                'response': response,
                'success': True
            }
        except Exception as e:
            error_message = f"Error processing message: {str(e)}"
            logger.error(error_message)
            
            # Add error message to conversation
            self.conversation_service.add_message(conversation.id, 'system', error_message)
            
            return {
                'conversation_id': conversation.id,
                'response': "I'm sorry, I encountered an error while processing your request.",
                'error': str(e),
                'success': False
            }
    
    def get_conversation_history(self, conversation_id: str) -> Optional[List[Dict[str, Any]]]:
        """
        Get the history of a conversation.
        
        Args:
            conversation_id (str): ID of the conversation
            
        Returns:
            Optional[List[Dict[str, Any]]]: List of messages if found, None otherwise
        """
        conversation = self.conversation_service.get_conversation(conversation_id)
        if not conversation:
            return None
        
        return [msg.to_dict() for msg in conversation.messages]
    
    def list_conversations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        List recent conversations.
        
        Args:
            limit (int): Maximum number of conversations to return
            
        Returns:
            List[Dict[str, Any]]: List of conversation summaries
        """
        conversations = self.conversation_service.list_conversations(limit)
        
        return [{
            'id': conv.id,
            'created_at': conv.created_at.isoformat(),
            'updated_at': conv.updated_at.isoformat(),
            'message_count': len(conv.messages),
            'metadata': conv.metadata
        } for conv in conversations]
    
    def create_new_conversation(self) -> Dict[str, Any]:
        """
        Create a new conversation.
        
        Returns:
            Dict[str, Any]: New conversation details
        """
        conversation = self.conversation_service.create_conversation()
        
        return {
            'conversation_id': conversation.id,
            'created_at': conversation.created_at.isoformat()
        }
