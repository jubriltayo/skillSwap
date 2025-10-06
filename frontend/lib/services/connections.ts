import { apiClient } from "@/lib/api/client";

interface ConnectionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class ConnectionService {
  static async sendRequest(
    postId: string,
    message?: string
  ): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.post(`/posts/${postId}/connections`, {
        message,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send connection request",
      };
    }
  }

  static async getPendingRequests(): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.get("/connections/pending");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch pending requests",
      };
    }
  }

  static async getAcceptedConnections(): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.get("/connections/accepted");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch accepted connections",
      };
    }
  }

  static async getAllConnections(): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.get("/connections");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch connections",
      };
    }
  }

  static async acceptRequest(
    connectionId: string
  ): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.post(
        `/connections/${connectionId}/accept`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to accept connection",
      };
    }
  }

  static async rejectRequest(
    connectionId: string
  ): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.post(
        `/connections/${connectionId}/reject`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to reject connection",
      };
    }
  }

  static async cancelRequest(
    connectionId: string
  ): Promise<ConnectionResponse> {
    try {
      await apiClient.delete(`/connections/${connectionId}/cancel`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to cancel connection",
      };
    }
  }
}
