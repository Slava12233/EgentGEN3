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
  InputAdornment,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import HttpIcon from '@mui/icons-material/Http';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WooCommerceSettings() {
  const [activeTab, setActiveTab] = useState(1);
  const [wooConfig, setWooConfig] = useState({
    url: '',
    consumerKey: '',
    consumerSecret: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/config/woocommerce`);
        if (response.data.success) {
          setWooConfig({
            ...response.data.data,
            consumerKey: response.data.data.consumerKey ? '********' : '',
            consumerSecret: response.data.data.consumerSecret ? '********' : '',
          });
        }
      } catch (error) {
        console.error('Error fetching WooCommerce config:', error);
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
    setWooConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveWooCommerce = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Don't send masked keys
      const configToSend = {
        ...wooConfig,
        consumerKey: wooConfig.consumerKey === '********' ? undefined : wooConfig.consumerKey,
        consumerSecret: wooConfig.consumerSecret === '********' ? undefined : wooConfig.consumerSecret,
      };

      const response = await axios.put(`${API_URL}/api/config/woocommerce`, configToSend);
      if (response.data.success) {
        setSuccess('WooCommerce configuration saved successfully');
        // Mask the keys in the UI
        if (wooConfig.consumerKey && wooConfig.consumerKey !== '********') {
          setWooConfig((prev) => ({
            ...prev,
            consumerKey: '********',
          }));
        }
        if (wooConfig.consumerSecret && wooConfig.consumerSecret !== '********') {
          setWooConfig((prev) => ({
            ...prev,
            consumerSecret: '********',
          }));
        }
      } else {
        setError('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving WooCommerce config:', error);
      setError('Failed to save configuration: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setError(null);
    setSuccess(null);
    setTestResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/config/woocommerce/test`);
      if (response.data.success) {
        setTestResult({
          success: true,
          message: 'Connection successful!',
          details: response.data.data,
        });
      } else {
        setTestResult({
          success: false,
          message: 'Connection failed',
          details: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error testing WooCommerce connection:', error);
      setTestResult({
        success: false,
        message: 'Connection failed',
        details: error.response?.data?.message || error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleRestartMcp = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_URL}/api/mcp/restart`);
      if (response.data.success) {
        setSuccess('MCP server restarted successfully');
      } else {
        setError('Failed to restart MCP server');
      }
    } catch (error) {
      console.error('Error restarting MCP server:', error);
      setError('Failed to restart MCP server: ' + (error.response?.data?.message || error.message));
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
          <Tab label="OpenAI" component={Link} href="/settings" />
          <Tab label="WooCommerce" />
          <Tab label="Agent" component={Link} href="/settings?tab=2" />
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

      {testResult && (
        <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{testResult.message}</Typography>
          {testResult.details && (
            <Typography variant="body2" component="pre" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              {typeof testResult.details === 'object'
                ? JSON.stringify(testResult.details, null, 2)
                : testResult.details}
            </Typography>
          )}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          WooCommerce Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configure the WooCommerce store connection settings.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Store URL"
              name="url"
              value={wooConfig.url}
              onChange={handleInputChange}
              helperText="Your WooCommerce store URL (e.g., https://example.com)"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consumer Key"
              name="consumerKey"
              value={wooConfig.consumerKey}
              onChange={handleInputChange}
              type="password"
              helperText="Your WooCommerce API consumer key"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consumer Secret"
              name="consumerSecret"
              value={wooConfig.consumerSecret}
              onChange={handleInputChange}
              type="password"
              helperText="Your WooCommerce API consumer secret"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            onClick={handleTestConnection}
            disabled={saving || testing}
            sx={{ mr: 2 }}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveWooCommerce}
            disabled={saving || testing}
            sx={{ mr: 2 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRestartMcp}
            disabled={saving || testing}
          >
            Restart MCP Server
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          How to Get WooCommerce API Keys
        </Typography>
        <Typography variant="body2" paragraph>
          To connect your WooCommerce store, you need to create API keys with read/write permissions:
        </Typography>
        <ol>
          <li>
            <Typography variant="body2">
              Log in to your WordPress admin dashboard
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Go to WooCommerce &gt; Settings &gt; Advanced &gt; REST API
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Click &quot;Add key&quot; and fill in the details:
              <ul>
                <li>Description: WooAgent</li>
                <li>User: Select an admin user</li>
                <li>Permissions: Read/Write</li>
              </ul>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Click &quot;Generate API key&quot;
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Copy the Consumer Key and Consumer Secret and paste them above
            </Typography>
          </li>
        </ol>
      </Paper>
    </Box>
  );
}
