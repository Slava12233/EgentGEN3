"""
Conversation Service

This module provides services for managing conversations.
"""

import os
import json
import uuid
import logging
from typing import Dict, Optional, List
from datetime import datetime

from models.conversation import Conversation, Message

logger = logging.getLogger('wooagent')

class ConversationService:
    """
    Service for managing conversations.
    """
    
    def __init__(self, storage_dir: str = 'conversations'):
        """
        Initialize the conversation service.
        
        Args:
            storage_dir (str): Directory to store conversation files
        """
        self.storage_dir = storage_dir
        self.active_conversations: Dict[str, Conversation] = {}
        
        # Create storage directory if it doesn't exist
        if not os.path.exists(storage_dir):
            os.makedirs(storage_dir)
            logger.info(f"Created conversation storage directory: {storage_dir}")
    
    def create_conversation(self, metadata: Optional[Dict] = None) -> Conversation:
        """
        Create a new conversation.
        
        Args:
            metadata (Optional[Dict]): Optional metadata for the conversation
            
        Returns:
            Conversation: The newly created conversation
        """
        conversation_id = str(uuid.uuid4())
        conversation = Conversation(
            id=conversation_id,
            metadata=metadata or {}
        )
        
        self.active_conversations[conversation_id] = conversation
        logger.info(f"Created new conversation with ID: {conversation_id}")
        
        return conversation
    
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """
        Get a conversation by ID.
        
        Args:
            conversation_id (str): ID of the conversation to retrieve
            
        Returns:
            Optional[Conversation]: The conversation if found, None otherwise
        """
        # Check if conversation is already loaded
        if conversation_id in self.active_conversations:
            return self.active_conversations[conversation_id]
        
        # Try to load conversation from file
        conversation_path = os.path.join(self.storage_dir, f"{conversation_id}.json")
        if os.path.exists(conversation_path):
            try:
                with open(conversation_path, 'r') as f:
                    conversation_data = json.load(f)
                
                conversation = Conversation.from_dict(conversation_data)
                self.active_conversations[conversation_id] = conversation
                logger.info(f"Loaded conversation from file: {conversation_id}")
                return conversation
            except Exception as e:
                logger.error(f"Error loading conversation {conversation_id}: {str(e)}")
        
        logger.warning(f"Conversation not found: {conversation_id}")
        return None
    
    def save_conversation(self, conversation: Conversation) -> bool:
        """
        Save a conversation to storage.
        
        Args:
            conversation (Conversation): The conversation to save
            
        Returns:
            bool: True if successful, False otherwise
        """
        conversation_path = os.path.join(self.storage_dir, f"{conversation.id}.json")
        try:
            with open(conversation_path, 'w') as f:
                json.dump(conversation.to_dict(), f, indent=2)
            
            logger.info(f"Saved conversation to file: {conversation.id}")
            return True
        except Exception as e:
            logger.error(f"Error saving conversation {conversation.id}: {str(e)}")
            return False
    
    def add_message(self, conversation_id: str, role: str, content: str) -> Optional[Message]:
        """
        Add a message to a conversation.
        
        Args:
            conversation_id (str): ID of the conversation
            role (str): Role of the message sender
            content (str): Content of the message
            
        Returns:
            Optional[Message]: The added message if successful, None otherwise
        """
        conversation = self.get_conversation(conversation_id)
        if not conversation:
            logger.warning(f"Cannot add message: Conversation {conversation_id} not found")
            return None
        
        message = conversation.add_message(role, content)
        self.save_conversation(conversation)
        
        logger.info(f"Added {role} message to conversation {conversation_id}")
        return message
    
    def list_conversations(self, limit: int = 10) -> List[Conversation]:
        """
        List recent conversations.
        
        Args:
            limit (int): Maximum number of conversations to return
            
        Returns:
            List[Conversation]: List of conversations
        """
        conversations = []
        
        # List conversation files
        if os.path.exists(self.storage_dir):
            files = [f for f in os.listdir(self.storage_dir) if f.endswith('.json')]
            files.sort(key=lambda f: os.path.getmtime(os.path.join(self.storage_dir, f)), reverse=True)
            
            # Load conversations
            for file in files[:limit]:
                conversation_id = file.replace('.json', '')
                conversation = self.get_conversation(conversation_id)
                if conversation:
                    conversations.append(conversation)
        
        return conversations
