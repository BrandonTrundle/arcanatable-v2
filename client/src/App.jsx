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
import DMToolkitLayout from "./Pages/DMToolkit/DMToolkitLayout";
import DMToolkitDashboard from "./Components/DMToolkit/DMToolkitGeneral/DMToolkitDashboard";
import Monsters from "./Pages/DMToolkit/Monsters/Monsters";
import NPCs from "./Pages/DMToolkit/NPCs/NPCs";
import Potions from "./Pages/DMToolkit/Potions/Potions";
import Items from "./Pages/DMToolkit/Items/Items";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-onboarding" element={<UserOnboarding />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaign-dashboard" element={<CampaignDashboard />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/manage-campaign" element={<ManageCampaigns />} />
        <Route path="/join-campaign" element={<JoinCampaign />} />

        <Route path="/dmtoolkit" element={<DMToolkitLayout />}>
          <Route index element={<DMToolkitDashboard />} />
          <Route path="monsters" element={<Monsters />} />
          <Route path="npcs" element={<NPCs />} />
          <Route path="potions" element={<Potions />} />
          <Route path="items" element={<Items />} />
          {/* <Route path="monsters" element={<Monsters />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
