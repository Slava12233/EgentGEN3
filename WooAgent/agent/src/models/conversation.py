"""
Conversation Model

This module defines the data structures for conversation memory.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime


@dataclass
class Message:
    """
    Represents a single message in a conversation.
    """
    role: str  # 'user', 'assistant', or 'system'
    content: str
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the message to a dictionary format.
        
        Returns:
            Dict[str, Any]: Dictionary representation of the message
        """
        return {
            'role': self.role,
            'content': self.content,
            'timestamp': self.timestamp.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Message':
        """
        Create a Message instance from a dictionary.
        
        Args:
            data (Dict[str, Any]): Dictionary containing message data
            
        Returns:
            Message: New Message instance
        """
        timestamp = datetime.fromisoformat(data['timestamp']) if 'timestamp' in data else datetime.now()
        return cls(
            role=data['role'],
            content=data['content'],
            timestamp=timestamp
        )


@dataclass
class Conversation:
    """
    Represents a conversation with message history.
    """
    id: str
    messages: List[Message] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def add_message(self, role: str, content: str) -> Message:
        """
        Add a new message to the conversation.
        
        Args:
            role (str): Role of the message sender ('user', 'assistant', or 'system')
            content (str): Content of the message
            
        Returns:
            Message: The newly added message
        """
        message = Message(role=role, content=content)
        self.messages.append(message)
        self.updated_at = datetime.now()
        return message
    
    def get_messages_for_context(self, max_messages: Optional[int] = None) -> List[Dict[str, str]]:
        """
        Get messages formatted for the OpenAI context.
        
        Args:
            max_messages (Optional[int]): Maximum number of messages to include
            
        Returns:
            List[Dict[str, str]]: List of message dictionaries with 'role' and 'content'
        """
        messages = self.messages
        if max_messages is not None:
            messages = messages[-max_messages:]
        
        return [{'role': msg.role, 'content': msg.content} for msg in messages]
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the conversation to a dictionary format.
        
        Returns:
            Dict[str, Any]: Dictionary representation of the conversation
        """
        return {
            'id': self.id,
            'messages': [msg.to_dict() for msg in self.messages],
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Conversation':
        """
        Create a Conversation instance from a dictionary.
        
        Args:
            data (Dict[str, Any]): Dictionary containing conversation data
            
        Returns:
            Conversation: New Conversation instance
        """
        messages = [Message.from_dict(msg) for msg in data.get('messages', [])]
        created_at = datetime.fromisoformat(data['created_at']) if 'created_at' in data else datetime.now()
        updated_at = datetime.fromisoformat(data['updated_at']) if 'updated_at' in data else datetime.now()
        
        return cls(
            id=data['id'],
            messages=messages,
            metadata=data.get('metadata', {}),
            created_at=created_at,
            updated_at=updated_at
        )
