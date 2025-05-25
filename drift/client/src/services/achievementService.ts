const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : "http://localhost:5000/api";

interface Achievement {
  _id: string;
  name: string;
  objective: string;
  deadline: string;
  dedication: string;
  completedDate: string;
  totalTasks: number;
  images: string[];
  userId: string;
  createdAt: string;
}

interface CreateAchievementData {
  name: string;
  objective: string;
  deadline: string;
  dedication: string;
  completedDate: string;
  totalTasks: number;
}

interface AchievementStats {
  totalAchievements: number;
  totalTasks: number;
  casualCount: number;
  moderateCount: number;
  intenseCount: number;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("userToken");
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all user achievements
export const getUserAchievements = async (): Promise<Achievement[]> => {
  try {
    console.log("Fetching achievements from:", `${API_BASE_URL}/achievements`);
    console.log("Auth headers:", getAuthHeaders());

    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("Fetch response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Fetched achievements data:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch achievements");
    }

    return data.achievements;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

// Create a new achievement
export const createAchievement = async (
  achievementData: CreateAchievementData
): Promise<Achievement> => {
  try {
    console.log("Creating achievement with data:", achievementData);
    console.log("API URL:", `${API_BASE_URL}/achievements`);
    console.log("Auth headers:", getAuthHeaders());

    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(achievementData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to create achievement");
    }

    return data.achievement;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }
};

// Create a new achievement with images
export const createAchievementWithImages = async (
  achievementData: CreateAchievementData,
  images: File[]
): Promise<Achievement> => {
  try {
    console.log("Creating achievement with images:", achievementData, images);
    
    const formData = new FormData();
    
    // Add achievement data to form
    Object.entries(achievementData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    // Add images to form
    images.forEach((image) => {
      formData.append('images', image);
    });

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/achievements`, {
      method: "POST",
      headers,
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to create achievement");
    }

    return data.achievement;
  } catch (error) {
    console.error("Error creating achievement with images:", error);
    throw error;
  }
};

// Delete an achievement
export const deleteAchievement = async (
  achievementId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/achievements/${achievementId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete achievement");
    }
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
};

// Get achievement statistics
export const getAchievementStats = async (): Promise<AchievementStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch achievement stats");
    }

    return data.stats;
  } catch (error) {
    console.error("Error fetching achievement stats:", error);
    throw error;
  }
};

export type { Achievement, CreateAchievementData, AchievementStats };