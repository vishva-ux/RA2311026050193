import React from 'react';
import { Box } from '@mui/material';

export default function AnimatedBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        // Beautiful sky gradient from top to bottom
        background: 'linear-gradient(180deg, #6BB0FF 0%, #A4D4FF 40%, #E8F5FF 100%)',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0.15, // Light noise
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }
      }}
    >
      {/* Drifting white "cloud" blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%', left: '-20%',
          width: '60vw', height: '30vw',
          background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          animation: 'cloudDrift1 40s linear infinite',
          filter: 'blur(40px)',
          '@keyframes cloudDrift1': {
            '0%': { transform: 'translateX(-20vw)' },
            '100%': { transform: 'translateX(120vw)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%', right: '-30%',
          width: '80vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          animation: 'cloudDrift2 60s linear infinite reverse',
          filter: 'blur(60px)',
          '@keyframes cloudDrift2': {
            '0%': { transform: 'translateX(30vw)' },
            '100%': { transform: 'translateX(-120vw)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%', left: '10%',
          width: '100vw', height: '50vw',
          background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          animation: 'cloudDrift3 50s ease-in-out infinite alternate',
          filter: 'blur(50px)',
          '@keyframes cloudDrift3': {
            '0%': { transform: 'translateX(-10vw) scale(1)' },
            '100%': { transform: 'translateX(20vw) scale(1.1)' }
          }
        }}
      />
    </Box>
  );
}
