require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/app.routes");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8000;

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ DB Connection Successful"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${appName}] Received request: ${req.method} ${req.url}`);
  next();
});
const server = createServer(app);
const appName = process.env.APP_NAME || "Unknown";
// Allow multiple frontend origins
// const allowedOrigins = ["http://localhost:5173", "http://localhost:8000", "http://localhost",
// "localhost:81","localhost:82","localhost:83"];

const corsOptions = {
  origin: "*",  // This allows all origins
  methods: ["GET", "POST"],
  credentials: true,  // Enable credentials if needed (e.g., cookies)
};

app.use(cors(corsOptions)); // for Express API

const io = new Server(server, {
  cors: corsOptions,  // For Socket.io as well
  pingTimeout: 60000,
  transports: ["websocket", "polling"],  // WebSocket and long-polling
});

// Apply CORS to Express & Socket.io
// app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send(`Hello from ${appName}`);
});


// Healthcheck API
app.get("/healthcheck", async (req, res) => {
  try {
    res.status(200).json({
      message: "🚀 Backend Service is Up and Running! 💻🌟",
      dBHealthCheck: "✅ PASS 🗄️",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Health check failed!",
      error: error.message,
    });
  }
});

// API Routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("✅ API is running..");
});

// Socket.io Connection Handling
io.on("connection", (socket) => {
  console.log("⚡ User Connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData.chatId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    if (!room) {
      console.log("❌ No chat room provided!");
      return;
    }
    socket.join(room);
    console.log(`✅ User Joined Room: ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    const data = {
      message: newMessageReceived.message,
      chatId: newMessageReceived.chatId,
      senderId: newMessageReceived.sender._id,
    };
    io.to(newMessageReceived.chatId).emit("message received", data);
  });

  socket.on("disconnect", () => {
    console.log("⚠️ User Disconnected:", socket.id);
  });
});

// Start Server
server.listen(port, '0.0.0.0' ,() => {
  console.log(`🚀 ${appName} Server is running on port ${port}`);
});
