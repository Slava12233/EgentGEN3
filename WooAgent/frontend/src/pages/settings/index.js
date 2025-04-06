import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [openaiConfig, setOpenaiConfig] = useState({
    apiKey: '',
    model: 'gpt-4',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/config/openai`);
        if (response.data.success) {
          setOpenaiConfig({
            ...response.data.data,
            apiKey: response.data.data.apiKey ? '********' : '',
          });
        }
      } catch (error) {
        console.error('Error fetching OpenAI config:', error);
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOpenaiConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveOpenAI = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Don't send masked API key
      const configToSend = {
        ...openaiConfig,
        apiKey: openaiConfig.apiKey === '********' ? undefined : openaiConfig.apiKey,
      };

      const response = await axios.put(`${API_URL}/api/config/openai`, configToSend);
      if (response.data.success) {
        setSuccess('OpenAI configuration saved successfully');
        // Mask the API key in the UI
        if (openaiConfig.apiKey && openaiConfig.apiKey !== '********') {
          setOpenaiConfig((prev) => ({
            ...prev,
            apiKey: '********',
          }));
        }
      } else {
        setError('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving OpenAI config:', error);
      setError('Failed to save configuration: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleRestartAgent = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_URL}/api/agent/restart`);
      if (response.data.success) {
        setSuccess('Agent restarted successfully');
      } else {
        setError('Failed to restart agent');
      }
    } catch (error) {
      console.error('Error restarting agent:', error);
      setError('Failed to restart agent: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="OpenAI" />
          <Tab label="WooCommerce" component={Link} href="/settings/woocommerce" />
          <Tab label="Agent" />
        </Tabs>
      </Paper>

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

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            OpenAI Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure the OpenAI API settings for the agent.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={openaiConfig.apiKey}
                onChange={handleInputChange}
                type="password"
                helperText="Your OpenAI API key"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={openaiConfig.model}
                onChange={handleInputChange}
                select
                SelectProps={{
                  native: true,
                }}
                helperText="Select the OpenAI model to use"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </TextField>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveOpenAI}
              disabled={saving}
              sx={{ mr: 2 }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRestartAgent}
              disabled={saving}
            >
              Restart Agent
            </Button>
          </Box>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Agent Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure the agent behavior and settings.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" paragraph>
            Agent configuration options will be available in a future update.
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRestartAgent}
              disabled={saving}
            >
              Restart Agent
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
