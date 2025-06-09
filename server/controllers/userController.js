const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Supabase client (with service role key for secure file uploads)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Onboarding Profile Update
const updateOnboarding = async (req, res) => {
  const userId = req.user.id;
  const { experience, preferredRole, playStyle, onboarded } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        experience: [experience],
        preferredRole: [preferredRole],
        playStyle: [playStyle],
        onboarded: onboarded === true,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Onboarding complete", user });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update onboarding",
      error: err.message,
    });
  }
};

// Avatar Upload + Replacement (Supabase)
const updateUserAvatar = async (req, res) => {
  const userId = req.params.userId;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.user.id !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // Remove old avatar if it exists
    if (user.avatar) {
      const fileName = user.avatar.split("/").pop();
      await supabase.storage.from("user-profile-pics").remove([fileName]);
    }

    // Create unique filename
    const fileExt = path.extname(file.originalname);
    const uniqueFileName = `${userId}_${uuidv4()}${fileExt}`;

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from("user-profile-pics")
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({ message: "Upload failed", error: uploadError.message });
    }

    // Get public URL for the uploaded avatar
    const { data: publicData, error: urlError } = supabase.storage
      .from("user-profile-pics")
      .getPublicUrl(uniqueFileName);

    if (urlError) {
      return res.status(500).json({
        message: "Could not retrieve avatar URL",
        error: urlError.message,
      });
    }

    // Save URL in DB
    user.avatar = publicData.publicUrl;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatarUrl: publicData.publicUrl,
    });
  } catch (err) {
    console.error("Error updating avatar:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Account Info (Username, Email, Password)
const updateUserAccount = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, currentPassword, newPassword } = req.body;

  if (req.user.id !== userId) {
    return res.status(403).json({ message: "Unauthorized: Access denied" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check for username conflict
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(409).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    // Update email
    if (email && email !== user.email) {
      user.email = email;
    }

    // Update password
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Update failed:", err);
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

module.exports = {
  updateOnboarding,
  updateUserAvatar,
  updateUserAccount,
};
