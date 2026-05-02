import api from './axios';
import logger from 'logging_middleware';

export const registerAndAuth = async () => {
  const credentials = {
    email: import.meta.env.VITE_EVAL_EMAIL || "student@srmist.edu.in",
    name: import.meta.env.VITE_EVAL_NAME || "Test User",
    mobileNo: import.meta.env.VITE_EVAL_MOBILE || "9999999999",
    githubUsername: import.meta.env.VITE_EVAL_GITHUB || "githubuser",
    rollNo: import.meta.env.VITE_EVAL_ROLLNO || "RA2311026050193",
    accessCode: import.meta.env.VITE_EVAL_ACCESS_CODE || "QkbpxH"
  };

  const loginPayload = {
    email: credentials.email,
    name: credentials.name,
    rollNo: credentials.rollNo,
    accessCode: credentials.accessCode
  };

  try {
    logger.Log('frontend', 'info', 'auth', 'Starting programmatic registration');
    let clientID = "8a5cc09f-5856-45fb-ad6e-ce6a9c01bc81"; 
    let clientSecret = "egzCgCxkQdNQYaVP";

    try {
      const regRes = await api.post('/register', credentials);
      logger.Log('frontend', 'info', 'auth', 'Registration successful');
      if (regRes.data && regRes.data.clientID) {
        clientID = regRes.data.clientID;
        clientSecret = regRes.data.clientSecret;
      }
    } catch (regError) {
      logger.Log('frontend', 'info', 'auth', 'Registration skipped/failed (likely already registered)');
    }

    logger.Log('frontend', 'info', 'auth', 'Starting programmatic auth');
    // For auth, it requires ALL fields: email, name, rollNo, accessCode, clientID, clientSecret
    const authRes = await api.post('/auth', {
      email: credentials.email,
      name: credentials.name,
      rollNo: credentials.rollNo,
      accessCode: credentials.accessCode,
      clientID,
      clientSecret
    });

    if (authRes.data && authRes.data.access_token) {
      localStorage.setItem('access_token', authRes.data.access_token);
      logger.setToken(authRes.data.access_token);
      logger.Log('frontend', 'info', 'auth', 'Authentication successful');
      return authRes.data;
    } else {
      throw new Error('Invalid token response');
    }
  } catch (error) {
    logger.Log('frontend', 'error', 'auth', `Auth Flow Failed: ${error.message}`);
    throw error;
  }
};
