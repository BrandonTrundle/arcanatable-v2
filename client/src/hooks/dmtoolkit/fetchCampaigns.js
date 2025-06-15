/**
 * Fetch campaigns for the authenticated user.
 * @param {Object} user - The authenticated user object containing a token.
 * @returns {Promise<Array>} - Resolves to an array of campaign objects.
 * @throws {Error} - If the request fails or token is missing.
 */

export async function fetchCampaigns(user) {
  if (!user?.token) {
    throw new Error("User token is required to fetch campaigns.");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch campaigns: ${errorText}`);
    }

    const data = await response.json();
    const allCampaigns = Array.isArray(data.campaigns) ? data.campaigns : [];

    // Only return campaigns created by the current user
    return allCampaigns.filter((campaign) => campaign.creatorId === user.id);
  } catch (error) {
    console.error("Error in fetchCampaigns:", error);
    throw error;
  }
}
