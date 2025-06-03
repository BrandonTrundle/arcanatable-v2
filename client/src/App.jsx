import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import UserOnboarding from "./Pages/UserOnboarding";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import CampaignDashboard from "./Pages/Campaigns/CampaignDashboard";
import CreateCampaign from "./Pages/Campaigns/CreateCampaign";
import ManageCampaigns from "./Pages/Campaigns/ManageCampaigns";
import JoinCampaign from "./Pages/Campaigns/JoinCampaign";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Future routes can be added here */}
        <Route path="/user-onboarding" element={<UserOnboarding />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaign-dashboard" element={<CampaignDashboard />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/manage-campaign" element={<ManageCampaigns />} />
        <Route path="/join-campaign" element={<JoinCampaign />} />
      </Routes>
    </Router>
  );
}

export default App;
