const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/connectDB");

const app = express();
const PORT = process.env.PORT || 4000;

// App Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const monsterRoutes = require("./routes/monsterRoutes");
const npcRoutes = require("./routes/npcRoutes");
const mapAssetsRoutes = require("./routes/mapAssetRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const mapRoutes = require("./routes/mapRoutes");
const characterRoutes = require("./routes/characterRoutes");

//Connect to MongoDB
connectDB();

//app.use
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/monsters", monsterRoutes);
app.use("/api/npcs", npcRoutes);
app.use("/api/mapassets", mapAssetsRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/characters", characterRoutes);

app.get("/", (req, res) => {
  res.send("ArcanaTable API is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
