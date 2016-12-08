require('babel-register')({
    presets: ['es2015']
});
const express = require('express');
const registerRoutes = require('./routes').default;
const app = express();
registerRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`🌍 Server is listening on ${port}`);
});

module.exports = app;
