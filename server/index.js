const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./utils/connectDB");

const app = express();
const PORT = process.env.PORT || 4000;

// HTTP server for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for security in production
    methods: ["GET", "POST"],
  },
});

// Modular Socket.IO setup
const registerSessionSockets = require("./sockets/sessionSockets");
registerSessionSockets(io);

// Connect to MongoDB
connectDB();

// Middleware & Routes
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/monsters", require("./routes/monsterRoutes"));
app.use("/api/npcs", require("./routes/npcRoutes"));
app.use("/api/mapassets", require("./routes/mapAssetRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes"));
app.use("/api/maps", require("./routes/mapRoutes"));
app.use("/api/characters", require("./routes/characterRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));

app.get("/", (req, res) => {
  res.send("ArcanaTable API is running.");
});

// Start the combined HTTP/Socket.IO server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
