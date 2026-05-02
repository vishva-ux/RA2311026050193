class LoggingMiddleware {
  constructor() {
    this.baseURL = '/evaluation-service';
    this.token = null;
    this.validStacks = ['frontend', 'backend'];
    this.validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    this.validPackages = ['api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'];
  }

  setToken(token) {
    this.token = token;
  }

  async _sendRequest(logPayload, attempt = 1) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify(logPayload)
      });

      if (!response.ok) {
        throw new Error(`Log API returned ${response.status}`);
      }
    } catch (error) {
      // 1-Retry Fallback
      if (attempt === 1) {
        console.warn(`[LoggingMiddleware] Failed to send log. Retrying in 1s...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this._sendRequest(logPayload, 2);
      } else {
        console.error(`[LoggingMiddleware] Failed to send log after 1 retry. Dropping log.`, error);
      }
    }
  }

  /**
   * Reusable Log function
   * @param {string} stack - "frontend" | "backend"
   * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
   * @param {string} pkg - package name
   * @param {string} message - The log message
   */
  Log(stack, level, pkg, message) {
    // Validate constraints
    if (!this.validStacks.includes(stack)) stack = 'frontend';
    if (!this.validLevels.includes(level)) level = 'info';
    if (!this.validPackages.includes(pkg)) pkg = 'utils';

    const logPayload = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString()
    };

    // Print to console for dev visibility
    const prefix = `[${level.toUpperCase()}] [${pkg}]`;
    if (level === "error" || level === "fatal") {
      console.error(prefix, message);
    } else if (level === "warn") {
      console.warn(prefix, message);
    } else {
      console.log(prefix, message);
    }

    // Fire and forget
    this._sendRequest(logPayload);
  }
}

const logger = new LoggingMiddleware();
export default logger;
