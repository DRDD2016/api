require('babel-register')({
  presets: ['es2015']
});
const express = require('express');
const registerRoutes = require('./register-routes').default;
const app = express();
const port = process.env.PORT || 3000;

registerRoutes(app);

app.listen(port, () => {
  console.info(`🌍 Server is listening on ${port}`);
});

module.exports = app;
