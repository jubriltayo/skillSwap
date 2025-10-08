import { apiClient } from "@/lib/api/client";
import type { User, BaseResponse, AuthResponseData } from "@/lib/types";

interface AuthServiceResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<BaseResponse<AuthResponseData>>(
        "/login",
        { email, password }
      );

      if (response.success && response.data?.user && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        return {
          success: true,
          user: response.data.user,
        };
      } else {
        return {
          success: false,
          error: response.message || "Login failed",
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  static async register(
    email: string,
    password: string,
    username: string,
    fullName: string
  ): Promise<AuthServiceResponse> {
    try {
      const response = await apiClient.post<BaseResponse<AuthResponseData>>(
        "/signup",
        {
          email,
          password,
          username,
          name: fullName,
          password_confirmation: password,
        }
      );

      if (response.success && response.data?.user && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        return {
          success: true,
          user: response.data.user,
        };
      } else {
        return {
          success: false,
          error: response.message || "Registration failed",
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return null;
      }

      const response = await apiClient.get<BaseResponse<User> | User>("/user");

      if (
        typeof response === "object" &&
        response !== null &&
        "success" in response
      ) {
        const baseResponse = response as BaseResponse<User>;
        if (baseResponse.success && baseResponse.data) {
          return baseResponse.data;
        }
        return null;
      }

      // Handle direct user object response
      if (
        typeof response === "object" &&
        response !== null &&
        "id" in response &&
        "email" in response
      ) {
        // Type guard to ensure it's a User
        const user = response as User;
        if (
          typeof user.id === "string" &&
          typeof user.email === "string" &&
          typeof user.username === "string" &&
          typeof user.name === "string"
        ) {
          return user;
        }
      }

      return null;
    } catch {
      localStorage.removeItem("auth_token");
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch {
      // Silent catch - we want to remove token regardless
    } finally {
      localStorage.removeItem("auth_token");
    }
  }
}
