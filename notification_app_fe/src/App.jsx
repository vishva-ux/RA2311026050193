import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PriorityInbox from './pages/PriorityInbox';
import AnimatedBackground from './components/AnimatedBackground';
import { registerAndAuth } from './api/auth';
import { useAppStore } from './store/useAppStore';
import logger from 'logging_middleware';

function App() {
  const { isAuthenticated, setAuth } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.Log('frontend', 'info', 'auth', 'Initializing Application Auth...');
        await registerAndAuth();
        setAuth(true);
        logger.Log('frontend', 'info', 'auth', 'Application initialized successfully');
      } catch (error) {
        console.error('Initialization failed', error);
        setInitError(error.message || 'Failed to authenticate');
        logger.Log('frontend', 'error', 'auth', `Initialization failed: ${error.message}`);
      } finally {
        setIsInitializing(false);
      }
    };

    if (!isAuthenticated) {
      initializeApp();
    } else {
      setIsInitializing(false);
    }
  }, [isAuthenticated, setAuth]);

  if (isInitializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="background.default">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" mt={3} color="text.secondary">Authenticating...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (initError) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="background.default">
          <Typography variant="h5" color="error" gutterBottom>Authentication Failed</Typography>
          <Typography variant="body1" color="text.secondary">{initError}</Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            Please check your .env configuration and verify the Live Server is online.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/priority" element={<PriorityInbox />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
