import axios from 'axios';
import logger from 'logging_middleware';

const baseURL = '/evaluation-service';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token & Log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.setToken(token); // Ensure middleware also has token
    }
    logger.Log('frontend', 'info', 'api', `Initiating request to ${config.url}`);
    return config;
  },
  (error) => {
    logger.Log('frontend', 'error', 'api', `Request configuration error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Response Interceptor: Log Success/Failure
api.interceptors.response.use(
  (response) => {
    logger.Log('frontend', 'info', 'api', `Request successful: ${response.config.url}`);
    return response;
  },
  (error) => {
    logger.Log('frontend', 'error', 'api', `API Error [${error.response?.status}]: ${error.message} on ${error.config?.url}`);
    return Promise.reject(error);
  }
);

export default api;
