const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swaggerConfig");
const session = require('express-session');
const authenticate = require('./app/models/auth.m')
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();


const port = process.env.PORT || 5000;
const app = express();
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: true, saveUninitialized: true }));

app.use(cors());

authenticate(app);

const server = createServer(app);
const io = new Server(server, {
  cors: ['localhost:3000']
});
const activeClient = new Map();
app.use((req, res, next) => {
  req.body.io = io;
  req.body.activeClient = activeClient;
  next();
})

// Socket.IO integration
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

router(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
