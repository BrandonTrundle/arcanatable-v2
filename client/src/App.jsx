import React, { useEffect, useRef, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import PrivateRoute from "./Components/General/PrivateRoute";

// Pages
import HomePage from "./Pages/HomePage";
import UserOnboarding from "./Pages/UserOnboarding";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import AccountSettings from "./Pages/AccountSettings";

// Campaigns
import CampaignDashboard from "./Pages/Campaigns/CampaignDashboard";
import CreateCampaign from "./Pages/Campaigns/CreateCampaign";
import ManageCampaigns from "./Pages/Campaigns/ManageCampaigns";
import JoinCampaign from "./Pages/Campaigns/JoinCampaign";

// Characters
import CharacterDashboard from "./Pages/Characters/CharacterDashboard";
import CreateCharacter from "./Pages/Characters/CreateCharacter";
import EditCharacter from "./Pages/Characters/EditCharacter";

// DM Toolkit
import DMToolkitLayout from "./Pages/DMToolkit/DMToolkitLayout";
import DMToolkitDashboard from "./Pages/DMToolkit/DMToolkitDashboard";
import Monsters from "./Pages/DMToolkit/Monsters/Monsters";
import NPCs from "./Pages/DMToolkit/NPCs/NPCs";
import Potions from "./Pages/DMToolkit/Potions/Potions";
import Items from "./Pages/DMToolkit/Items/Items";
import Maps from "./Pages/DMToolkit/Maps/Maps";
import Tokens from "./Pages/DMToolkit/Tokens/Tokens";
import MapAssets from "./Pages/DMToolkit/MapAssets/MapAssets";
import Rules from "./Pages/DMToolkit/Rules/Rules";
import CheatSheet from "./Pages/DMToolkit/CheatSheet/CheatSheet";
import ToolkitMapEditor from "./Pages/DMToolkit/Maps/ToolkitMapEditor";

// Track total time across app
function TrackedApp() {
  const { user } = useContext(AuthContext);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleUnload = () => {
      const endTime = Date.now();
      const sessionMs = endTime - startTimeRef.current;
      const sessionHours = sessionMs / (1000 * 60 * 60);

      if (user?.id && sessionHours > 0.01) {
        navigator.sendBeacon(
          `http://localhost:4000/api/users/${user.id}/hours`,
          JSON.stringify({ hours: sessionHours, token: user.token })
        );
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/user-onboarding" element={<UserOnboarding />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaign-dashboard"
          element={
            <PrivateRoute>
              <CampaignDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <PrivateRoute>
              <CreateCampaign />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-campaign"
          element={
            <PrivateRoute>
              <ManageCampaigns />
            </PrivateRoute>
          }
        />
        <Route
          path="/join-campaign"
          element={
            <PrivateRoute>
              <JoinCampaign />
            </PrivateRoute>
          }
        />
        <Route
          path="/characters"
          element={
            <PrivateRoute>
              <CharacterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/characters/create"
          element={
            <PrivateRoute>
              <CreateCharacter />
            </PrivateRoute>
          }
        />
        <Route
          path="/characters/edit/:id"
          element={
            <PrivateRoute>
              <EditCharacter />
            </PrivateRoute>
          }
        />

        {/* DM Toolkit with Nested Routes */}
        <Route
          path="/dmtoolkit"
          element={
            <PrivateRoute>
              <DMToolkitLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DMToolkitDashboard />} />
          <Route path="monsters" element={<Monsters />} />
          <Route path="npcs" element={<NPCs />} />
          <Route path="potions" element={<Potions />} />
          <Route path="items" element={<Items />} />
          <Route path="maps" element={<Maps />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="assets" element={<MapAssets />} />
          <Route path="rules" element={<Rules />} />
          <Route path="cheatsheet" element={<CheatSheet />} />
        </Route>

        <Route
          path="/dmtoolkit/maps/editor"
          element={
            <PrivateRoute>
              <ToolkitMapEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <TrackedApp />
    </AuthProvider>
  );
}

export default App;
