require('env2')('.env');
require('babel-register')({
  presets: ['es2015']
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const registerRoutes = require('./src/lib/register-routes').default;
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
app.use(morgan('combined'));

registerRoutes(app);

app.listen(port, () => {
  console.info(`🌍 Server is listening on ${port}`);
});

module.exports = app;
