const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/connectDB"); // ✅ Add this line

const app = express();
const PORT = process.env.PORT || 4000;

// App Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

//Connect to MongoDB
connectDB();

//app.use
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("ArcanaTable API is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
