const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/config',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
    })
  );
  app.use(
    '/config',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
    })
  );
};
