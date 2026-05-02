import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';

const getTypeConfig = (type) => {
  switch (type?.toLowerCase()) {
    case 'placement':
      return { color: 'error', icon: <BusinessCenterIcon fontSize="small" /> };
    case 'result':
      return { color: 'warning', icon: <AssignmentTurnedInIcon fontSize="small" /> };
    case 'event':
      return { color: 'info', icon: <EventIcon fontSize="small" /> };
    default:
      return { color: 'default', icon: null };
  }
};

export default function NotificationCard({ notification, onMarkRead }) {
  const { ID, Type, Message, Timestamp, isRead } = notification;
  const config = getTypeConfig(Type);

  return (
    <Card 
      sx={{ 
        mb: 2, 
        opacity: isRead ? 0.7 : 1,
        borderLeft: isRead ? '4px solid #e0e0e0' : `4px solid var(--mui-palette-${config.color}-main)`,
        backgroundColor: isRead ? 'background.default' : 'background.paper',
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" flexDirection="column" gap={1} flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                icon={config.icon} 
                label={Type} 
                size="small" 
                color={config.color}
                variant={isRead ? "outlined" : "filled"}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(Timestamp), { addSuffix: true })}
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ fontWeight: isRead ? 400 : 600 }}>
              {Message}
            </Typography>
          </Box>

          <Box ml={2}>
            <IconButton 
              onClick={() => !isRead && onMarkRead(ID)}
              color={isRead ? "success" : "default"}
              title={isRead ? "Viewed" : "Mark as viewed"}
              disabled={isRead}
            >
              {isRead ? <CheckCircleIcon /> : <CheckCircleOutlinedIcon />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
