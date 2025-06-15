/**
 * Fetch all campaigns accessible to the user (no filtering by creator).
 * @param {Object} user - The authenticated user object with a token.
 * @returns {Promise<Array>} - Resolves to all campaigns the user can see.
 */
export async function fetchAllCampaigns(user) {
  if (!user?.token) {
    console.error("fetchAllCampaigns: No user token provided.");
    throw new Error("User token is required to fetch campaigns.");
  }

  console.log("fetchAllCampaigns: Fetching campaigns for user", user.id);

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`;
  console.log("fetchAllCampaigns: Requesting from", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    console.log("fetchAllCampaigns: Response status", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fetchAllCampaigns: Fetch failed with:", errorText);
      throw new Error(`Failed to fetch campaigns: ${errorText}`);
    }

    const data = await response.json();
    console.log("fetchAllCampaigns: Raw response data:", data);

    const campaigns = Array.isArray(data.campaigns) ? data.campaigns : [];
    console.log("fetchAllCampaigns: Returning", campaigns.length, "campaigns");
    return campaigns;
  } catch (error) {
    console.error("fetchAllCampaigns: Error caught:", error);
    throw error;
  }
}
