import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [status, setStatus] = useState({
    agent: 'loading',
    integration: 'loading',
    mcp: 'loading',
  });
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check agent status
        try {
          await axios.get(`${API_URL}/api/health/agent`);
          setStatus((prev) => ({ ...prev, agent: 'online' }));
        } catch (error) {
          setStatus((prev) => ({ ...prev, agent: 'offline' }));
        }

        // Check integration status (if we can reach this endpoint, integration is online)
        try {
          await axios.get(`${API_URL}/api/health`);
          setStatus((prev) => ({ ...prev, integration: 'online' }));
        } catch (error) {
          setStatus((prev) => ({ ...prev, integration: 'offline' }));
        }

        // Check MCP status
        try {
          await axios.get(`${API_URL}/api/health/mcp`);
          setStatus((prev) => ({ ...prev, mcp: 'online' }));
        } catch (error) {
          setStatus((prev) => ({ ...prev, mcp: 'offline' }));
        }

        // Get recent conversations
        try {
          const response = await axios.get(`${API_URL}/api/chat/conversations?limit=5`);
          setConversations(response.data.data || []);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking status:', error);
        setLoading(false);
      }
    };

    checkStatus();
    // Poll status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success.main';
      case 'offline':
        return 'error.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Status Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Agent Status
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(status.agent),
                        mr: 1,
                      }}
                    />
                    <Typography>
                      {status.agent === 'loading' ? 'Checking...' : status.agent}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Integration Status
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(status.integration),
                        mr: 1,
                      }}
                    />
                    <Typography>
                      {status.integration === 'loading' ? 'Checking...' : status.integration}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    MCP Server Status
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(status.mcp),
                        mr: 1,
                      }}
                    />
                    <Typography>
                      {status.mcp === 'loading' ? 'Checking...' : status.mcp}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/chat" passHref>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  fullWidth
                  sx={{ height: '100%', minHeight: 100 }}
                >
                  Start Chat
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/settings" passHref>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  fullWidth
                  sx={{ height: '100%', minHeight: 100 }}
                >
                  Configure Agent
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/settings/woocommerce" passHref>
                <Button
                  variant="outlined"
                  startIcon={<StorefrontIcon />}
                  fullWidth
                  sx={{ height: '100%', minHeight: 100 }}
                >
                  WooCommerce Settings
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/logs" passHref>
                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                  fullWidth
                  sx={{ height: '100%', minHeight: 100 }}
                >
                  View Logs
                </Button>
              </Link>
            </Grid>
          </Grid>

          {/* Recent Conversations */}
          <Typography variant="h5" gutterBottom>
            Recent Conversations
          </Typography>
          {conversations.length > 0 ? (
            <Grid container spacing={2}>
              {conversations.map((conversation) => (
                <Grid item xs={12} key={conversation.id}>
                  <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">
                          Conversation {conversation.id.substring(0, 8)}...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(conversation.updated_at).toLocaleString()} - 
                          {conversation.message_count} messages
                        </Typography>
                      </Box>
                      <Link href={`/chat?id=${conversation.id}`} passHref>
                        <Button variant="contained" size="small">
                          Continue
                        </Button>
                      </Link>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No recent conversations found.
              </Typography>
              <Box mt={2}>
                <Link href="/chat" passHref>
                  <Button variant="contained" startIcon={<ChatIcon />}>
                    Start a New Conversation
                  </Button>
                </Link>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
