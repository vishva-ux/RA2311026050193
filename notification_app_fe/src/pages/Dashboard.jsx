import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Pagination, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import api from '../api/axios';
import { useAppStore } from '../store/useAppStore';
import NotificationCard from '../components/NotificationCard';
import logger from 'logging_middleware';

export default function Dashboard() {
  const { notifications, setNotifications, markAsRead } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('All');
  const limit = 10;

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterType]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      logger.Log('frontend', 'info', 'page', `Fetching notifications for page ${page}, filter ${filterType}`);
      const params = { page, limit };
      if (filterType !== 'All') {
        params.notification_type = filterType;
      }

      const response = await api.get('/notifications', { params });
      if (response.data && response.data.notifications) {
        // Appending / replacing based on how the backend sends them. 
        // We will just replace the list for this page view, but the store handles 'isRead' memory.
        setNotifications(response.data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    logger.Log('frontend', 'info', 'page', `Pagination changed to page ${value}`);
    setPage(value);
  };

  const handleFilterChange = (event) => {
    logger.Log('frontend', 'info', 'page', `Filter changed to ${event.target.value}`);
    setFilterType(event.target.value);
    setPage(1); // reset to page 1 on filter
  };

  const handleMarkRead = (id) => {
    logger.Log('frontend', 'info', 'component', `User clicked mark as read for ID ${id}`);
    markAsRead(id);
  };

  if (loading && notifications.length === 0) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Box maxWidth="lg" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">All Notifications</Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            label="Filter Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {notifications.length === 0 && !loading && !error && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications found.</Typography>
        </Paper>
      )}

      {notifications.map((notif) => (
        <NotificationCard 
          key={notif.ID} 
          notification={notif} 
          onMarkRead={handleMarkRead} 
        />
      ))}

      {notifications.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
          <Pagination 
            count={10} // Hardcoded roughly since the mock API doesn't return total_pages
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
}
