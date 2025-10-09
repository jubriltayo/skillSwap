import { apiClient } from "@/lib/api/client";
import type {
  User,
  BaseResponse,
  PaginatedResponse,
  UserStats,
  SkillsUpdateData,
  AvatarUpdateData,
} from "@/lib/types";

export class UserService {
  static async getUsers(): Promise<BaseResponse<User[]>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>("/users");

      if (response && response.success !== undefined) {
        return {
          success: response.success,
          data: response.data,
          error: response.error,
        };
      }

      return {
        success: true,
        data: Array.isArray(response) ? response : [],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  }

  static async getUser(id: string): Promise<BaseResponse<User>> {
    try {
      const response = await apiClient.get<BaseResponse<User>>(`/users/${id}`);

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as User,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      };
    }
  }

  static async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<BaseResponse<User>> {
    try {
      const response = await apiClient.put<BaseResponse<User>>(
        `/users/${id}`,
        userData
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as User,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      };
    }
  }

  static async searchUsers(query: string): Promise<BaseResponse<User[]>> {
    try {
      const response = await apiClient.get<BaseResponse<User[]>>(
        `/users/search?q=${encodeURIComponent(query)}`
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: Array.isArray(response) ? response : [],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to search users",
      };
    }
  }

  static async updateUserSkills(
    userId: string,
    skillsData: SkillsUpdateData
  ): Promise<BaseResponse<User>> {
    try {
      const response = await apiClient.put<BaseResponse<User>>(
        `/users/${userId}/skills`,
        skillsData
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as User,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update skills",
      };
    }
  }

  static async getUserConnectionCount(
    userId: string
  ): Promise<BaseResponse<UserStats>> {
    try {
      const response = await apiClient.get<BaseResponse<UserStats>>(
        `/users/${userId}/connection-count`
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as UserStats,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch connection count",
      };
    }
  }

  static async updateAvatar(
    userId: string,
    avatarFile: File
  ): Promise<BaseResponse<User>> {
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(avatarFile);
      });

      const response = await apiClient.post<BaseResponse<User>>(
        `/users/${userId}/avatar`,
        {
          avatar_base64: base64Data,
          file_type: avatarFile.type,
        } as AvatarUpdateData
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as User,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload avatar",
      };
    }
  }
}
