const Session = require("../models/Session");
const Campaign = require("../models/Campaign");

/**
 * Create or reuse a session for a campaign.
 * The sessionCode is derived from the campaign's inviteCode.
 */
exports.createSession = async (req, res) => {
  try {
    const { campaignId } = req.body;
    const hostId = req.user.id;

    if (!campaignId) {
      return res.status(400).json({ message: "Campaign ID is required" });
    }

    // Check if a session already exists for this campaign
    let session = await Session.findOne({ campaignId });
    if (session) {
      return res.status(200).json({ session });
    }

    // Retrieve the campaign to get the inviteCode
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const sessionCode = campaign.inviteCode;
    if (!sessionCode) {
      return res.status(400).json({ message: "Campaign has no invite code" });
    }

    // Create a new session using the campaign's inviteCode
    session = await Session.create({
      campaignId,
      sessionCode,
      hostId,
    });

    res.status(201).json({ session });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session" });
  }
};

/**
 * Get a session using its public sessionCode.
 */
exports.getSessionByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const session = await Session.findOne({ sessionCode: code });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (err) {
    console.error("Error fetching session by code:", err);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};

/**
 * Get a session by its MongoDB _id.
 */
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (err) {
    console.error("Error fetching session by ID:", err);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};

exports.setActiveMap = async (req, res) => {
  const { sessionCode } = req.params;
  const { mapId } = req.body;

  try {
    const session = await Session.findOneAndUpdate(
      { sessionCode: sessionCode },
      { currentMapId: mapId },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Map updated", session });
  } catch (err) {
    console.error("Error setting active map:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
