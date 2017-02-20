require('dotenv').config();
require('babel-register')({
  presets: ['es2015'],
  plugins: ['transform-object-rest-spread']
});
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const registerRoutes = require('./src/lib/register-routes').default;
const socketRouter = require('./socket-router');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
app.use(morgan('combined'));
app.use(express.static('public')); // css/js
app.set('view engine', 'ejs');

registerRoutes(app);

// socket io stuff
const server = http.Server(app);
const websocket = socketio(server);

websocket.of('/feed').on('connection', socketRouter);

server.listen(port, () => {
  console.info(`🌍 Server is listening on ${port}`);
});

module.exports = app;
