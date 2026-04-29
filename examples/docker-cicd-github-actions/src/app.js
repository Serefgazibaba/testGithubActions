const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple JSON response
app.get('/', (req, res) => {
  res.json({
    message: 'Hello! Automatically deployed with GitHub Actions! 🚀',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local'
  });
});

// Health check endpoint (important for Docker!)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'GitHub Actions Demo API',
    version: '1.0.0',
    endpoints: [
      { path: '/', method: 'GET', description: 'Home page' },
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/api/info', method: 'GET', description: 'API information' }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    suggestion: 'Visit /api/info for available endpoints'
  });
});

// Start server only when run directly (not for tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for tests
module.exports = app;
