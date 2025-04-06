"""
Agent Tests

This module contains tests for the AI agent.
"""

import os
import unittest
from unittest.mock import patch, MagicMock
from dotenv import load_dotenv

# Load environment variables for testing
load_dotenv()

# Import the agent service
from src.services.agent_service import AgentService

class TestAgent(unittest.TestCase):
    """
    Test cases for the AI agent.
    """
    
    @patch('openai.OpenAI')
    @patch('openai_agents.Agent')
    @patch('openai_agents.MCPTool')
    def test_agent_initialization(self, mock_mcp_tool, mock_agent, mock_openai):
        """
        Test that the agent initializes correctly.
        """
        # Mock the OpenAI client
        mock_openai_instance = MagicMock()
        mock_openai.return_value = mock_openai_instance
        
        # Mock the Agent
        mock_agent_instance = MagicMock()
        mock_agent.return_value = mock_agent_instance
        
        # Mock the MCPTool
        mock_mcp_tool_instance = MagicMock()
        mock_mcp_tool.return_value = mock_mcp_tool_instance
        
        # Initialize the agent service
        agent_service = AgentService(
            openai_api_key="test_key",
            mcp_server_url="http://localhost:3000"
        )
        
        # Assert that the OpenAI client was initialized with the correct API key
        mock_openai.assert_called_once_with(api_key="test_key")
        
        # Assert that the Agent was initialized with the correct parameters
        mock_agent.assert_called_once()
        self.assertEqual(mock_agent.call_args[1]['client'], mock_openai_instance)
        self.assertEqual(mock_agent.call_args[1]['model'], "gpt-4")
        
        # Assert that the MCPTool was initialized with the correct server URL
        mock_mcp_tool.assert_called_once_with("WooCommerceTools", server_url="http://localhost:3000")
        
        # Assert that the tool was registered with the agent
        mock_agent_instance.register_tool.assert_called_once_with(mock_mcp_tool_instance)
        
        # Assert that the system prompt was set
        mock_agent_instance.set_system_prompt.assert_called_once()
    
    @patch('openai.OpenAI')
    @patch('openai_agents.Agent')
    @patch('openai_agents.MCPTool')
    def test_process_message(self, mock_mcp_tool, mock_agent, mock_openai):
        """
        Test that the agent processes messages correctly.
        """
        # Mock the OpenAI client
        mock_openai_instance = MagicMock()
        mock_openai.return_value = mock_openai_instance
        
        # Mock the Agent
        mock_agent_instance = MagicMock()
        mock_agent_instance.run.return_value = "This is a test response"
        mock_agent.return_value = mock_agent_instance
        
        # Mock the MCPTool
        mock_mcp_tool_instance = MagicMock()
        mock_mcp_tool.return_value = mock_mcp_tool_instance
        
        # Initialize the agent service
        agent_service = AgentService(
            openai_api_key="test_key",
            mcp_server_url="http://localhost:3000"
        )
        
        # Create a new conversation
        conversation = agent_service.create_new_conversation()
        conversation_id = conversation['conversation_id']
        
        # Process a message
        response = agent_service.process_message(conversation_id, "Test message")
        
        # Assert that the agent was called with the correct message
        mock_agent_instance.run.assert_called_once()
        self.assertEqual(mock_agent_instance.run.call_args[0][0], "Test message")
        
        # Assert that the response contains the expected data
        self.assertEqual(response['conversation_id'], conversation_id)
        self.assertEqual(response['response'], "This is a test response")
        self.assertTrue(response['success'])

if __name__ == '__main__':
    unittest.main()
