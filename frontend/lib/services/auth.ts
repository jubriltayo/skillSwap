import { apiClient } from "@/lib/api/client";

interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/login", { email, password });

      if (response.success && response.data.user && response.data.token) {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  }

  static async register(
    email: string,
    password: string,
    username: string,
    fullName: string
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/signup", {
        email,
        password,
        username,
        name: fullName,
        password_confirmation: password,
      });

      if (response.success && response.data.user && response.data.token) {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  }

  static async getCurrentUser(): Promise<any> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return null;
      }

      const response = await apiClient.get("/user");

      // Handle direct user object response
      if (response.id && response.email) {
        return response;
      }

      // Handle wrapped response
      if (response.data && response.data.id) {
        return response.data;
      }

      return null;
    } catch (error) {
      localStorage.removeItem("auth_token");
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
    }
  }
}
