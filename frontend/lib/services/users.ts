import { apiClient } from "@/lib/api/client";

interface UserResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class UserService {
  static async getUsers(): Promise<UserResponse> {
    try {
      const response = await apiClient.get("/users");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch users",
      };
    }
  }

  static async getUser(id: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch user",
      };
    }
  }

  static async updateUser(id: string, userData: any): Promise<UserResponse> {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update user",
      };
    }
  }

  static async searchUsers(query: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Search users error:", error);
      return {
        success: false,
        error: error.message || "Failed to search users",
      };
    }
  }

  static async updateUserSkills(
    userId: string,
    skillsData: {
      skills_offered?: string[];
      skills_wanted?: string[];
    }
  ): Promise<UserResponse> {
    try {
      const response = await apiClient.put(
        `/users/${userId}/skills`,
        skillsData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Update skills error:", error);
      return {
        success: false,
        error: error.message || "Failed to update skills",
      };
    }
  }

  static async getUserConnectionCount(userId: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get(`/users/${userId}/connection-count`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch connection count",
      };
    }
  }

  static async updateAvatar(
    userId: string,
    avatarFile: File
  ): Promise<UserResponse> {
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(avatarFile);
      });

      console.log("🔄 Sending avatar upload request...");
      const response = await apiClient.post(`/users/${userId}/avatar`, {
        avatar_base64: base64Data,
        file_type: avatarFile.type,
      });

      console.log("📦 FULL API RESPONSE:", response);
      console.log(
        "🖼️  Avatar URL:",
        response.avatar_url || response.data?.avatar_url
      );
      console.log("👤 Full user data:", response.data);

      // The response structure is: {success, message, data: {user object}}
      return {
        success: true,
        data: response.data, // This contains the full user object with avatar_url
      };
    } catch (error: any) {
      console.error("❌ Avatar upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload avatar",
      };
    }
  }
}
