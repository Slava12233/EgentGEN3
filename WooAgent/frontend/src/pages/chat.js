import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const router = useRouter();
  const { id: conversationId } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversation history
  useEffect(() => {
    if (!router.isReady) return;

    const loadConversation = async () => {
      if (conversationId) {
        try {
          const response = await axios.get(`${API_URL}/api/chat/conversations/${conversationId}`);
          if (response.data.success) {
            setMessages(response.data.data.messages || []);
            setCurrentConversationId(conversationId);
          } else {
            setError('Failed to load conversation');
          }
        } catch (error) {
          console.error('Error loading conversation:', error);
          setError('Failed to load conversation. The conversation may not exist.');
        }
      } else {
        // Create a new conversation
        try {
          const response = await axios.post(`${API_URL}/api/chat/conversations`);
          if (response.data.success) {
            setCurrentConversationId(response.data.data.conversation_id);
          } else {
            setError('Failed to create new conversation');
          }
        } catch (error) {
          console.error('Error creating conversation:', error);
          setError('Failed to create new conversation');
        }
      }
      setInitialLoading(false);
    };

    loadConversation();
  }, [router.isReady, conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        conversationId: currentConversationId,
        message: input,
      });

      if (response.data.success) {
        const agentMessage = {
          role: 'assistant',
          content: response.data.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        setError('Failed to get response from agent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to communicate with agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    router.push('/chat');
  };

  const getMessageClass = (role) => {
    switch (role) {
      case 'user':
        return 'user-message';
      case 'assistant':
        return 'agent-message';
      case 'system':
        return 'system-message';
      default:
        return '';
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Chat</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleNewConversation}
        >
          New Conversation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          height: 'calc(100vh - 250px)',
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start a conversation with the WooAgent
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <Box
                key={index}
                className={`chat-message ${getMessageClass(message.role)}`}
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
          {loading && (
            <Box className="chat-message agent-message" alignSelf="flex-start">
              <Box className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !currentConversationId}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            type="submit"
            disabled={loading || !input.trim() || !currentConversationId}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
