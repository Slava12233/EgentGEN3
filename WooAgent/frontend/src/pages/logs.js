import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Logs() {
  const [activeTab, setActiveTab] = useState(0);
  const [logs, setLogs] = useState({
    agent: [],
    integration: [],
    mcp: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearType, setClearType] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/api/logs`);
      if (response.data.success) {
        setLogs(response.data.data);
      } else {
        setError('Failed to load logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to load logs: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Poll logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleClearLogs = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/logs`, {
        params: { type: clearType },
      });
      if (response.data.success) {
        setSuccess(`${clearType ? clearType : 'All'} logs cleared successfully`);
        fetchLogs();
      } else {
        setError('Failed to clear logs');
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      setError('Failed to clear logs: ' + (error.response?.data?.message || error.message));
    } finally {
      setClearDialogOpen(false);
    }
  };

  const handleOpenClearDialog = (type) => {
    setClearType(type);
    setClearDialogOpen(true);
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false);
  };

  const handleOpenLogDetails = (log) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getLogList = () => {
    let currentLogs = [];
    switch (activeTab) {
      case 0:
        currentLogs = logs.agent;
        break;
      case 1:
        currentLogs = logs.integration;
        break;
      case 2:
        currentLogs = logs.mcp;
        break;
      default:
        currentLogs = [];
    }

    if (!currentLogs || currentLogs.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No logs found
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {currentLogs.map((log, index) => (
          <ListItem
            key={index}
            divider={index < currentLogs.length - 1}
            secondaryAction={
              <IconButton edge="end" aria-label="details" onClick={() => handleOpenLogDetails(log)}>
                <InfoIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  color={
                    log.level === 'error'
                      ? 'error'
                      : log.level === 'warning'
                      ? 'warning.main'
                      : 'text.primary'
                  }
                >
                  {log.message || JSON.stringify(log)}
                </Typography>
              }
              secondary={
                log.timestamp ? new Date(log.timestamp).toLocaleString() : 'No timestamp'
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const getTabLabel = (type) => {
    const count = logs[type]?.length || 0;
    return `${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Logs</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleOpenClearDialog(activeTab === 0 ? 'agent' : activeTab === 1 ? 'integration' : 'mcp')}
          >
            Clear Logs
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="logs tabs">
          <Tab label={getTabLabel('agent')} />
          <Tab label={getTabLabel('integration')} />
          <Tab label={getTabLabel('mcp')} />
        </Tabs>
      </Paper>

      <Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          getLogList()
        )}
      </Paper>

      {/* Log Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Timestamp: {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : 'N/A'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Level: {selectedLog.level || 'N/A'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Message:
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 300, overflow: 'auto' }}
              >
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedLog.message || JSON.stringify(selectedLog, null, 2)}
                </Typography>
              </Paper>
              {selectedLog.stack && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Stack Trace:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 300, overflow: 'auto' }}
                  >
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedLog.stack}
                    </Typography>
                  </Paper>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Clear Logs Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={handleCloseClearDialog}>
        <DialogTitle>Clear Logs</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear {clearType ? `${clearType} logs` : 'all logs'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearDialog}>Cancel</Button>
          <Button onClick={handleClearLogs} color="error">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
