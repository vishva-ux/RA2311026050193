import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { useAppStore } from '../store/useAppStore';
import NotificationCard from '../components/NotificationCard';
import { getTopNNotifications } from '../services/PriorityEngine';
import logger from 'logging_middleware';

export default function PriorityInbox() {
  const { notifications, markAsRead } = useAppStore();
  const [limit, setLimit] = useState(10);

  // Compute Top N notifications from store
  const topNotifications = getTopNNotifications(notifications, limit);

  const handleLimitChange = (event) => {
    logger.Log('frontend', 'info', 'page', `Priority inbox limit changed to ${event.target.value}`);
    setLimit(event.target.value);
  };

  const handleMarkRead = (id) => {
    logger.Log('frontend', 'info', 'component', `User clicked mark as read for Priority ID ${id}`);
    markAsRead(id);
  };

  return (
    <Box maxWidth="lg" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>Priority Inbox</Typography>
          <Typography variant="body2" color="text.secondary">
            Displaying the top most important unread notifications.
          </Typography>
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show Top</InputLabel>
          <Select
            value={limit}
            label="Show Top"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {topNotifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You're all caught up! No high-priority unread notifications right now.
          </Typography>
        </Paper>
      ) : (
        topNotifications.map((notif) => (
          <NotificationCard 
            key={notif.ID} 
            notification={notif} 
            onMarkRead={handleMarkRead} 
          />
        ))
      )}
    </Box>
  );
}
