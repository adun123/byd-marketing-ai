const app = require('../../backend/src/index.js').default;

module.exports = function handler(req, res) {
  // Delegate to the Express app
  return app(req, res);
}