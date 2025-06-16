const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");

exports.createSession = async (req, res) => {
  try {
    const { campaignId } = req.body;
    const hostId = req.user.id;

    if (!campaignId) {
      return res.status(400).json({ message: "Campaign ID is required" });
    }

    const sessionCode = uuidv4().split("-")[0].toUpperCase(); // short readable code

    const newSession = await Session.create({
      campaignId,
      sessionCode,
      hostId,
    });

    res.status(201).json({ session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session" });
  }
};

exports.getSessionByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const session = await Session.findOne({ sessionCode: code });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};
