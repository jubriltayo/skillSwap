import { apiClient } from "@/lib/api/client";
import type {
  BaseResponse,
  Connection,
  ConnectionResponseData,
} from "@/lib/types";

export class ConnectionService {
  static async sendRequest(
    postId: string,
    message?: string
  ): Promise<BaseResponse<Connection>> {
    try {
      const response = await apiClient.post<BaseResponse<Connection>>(
        `/posts/${postId}/connections`,
        {
          message,
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send connection request",
      };
    }
  }

  static async getPendingRequests(): Promise<BaseResponse<Connection[]>> {
    try {
      const response = await apiClient.get<BaseResponse<Connection[]>>(
        "/connections/pending"
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending requests",
      };
    }
  }

  static async getAcceptedConnections(): Promise<BaseResponse<Connection[]>> {
    try {
      const response = await apiClient.get<BaseResponse<Connection[]>>(
        "/connections/accepted"
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch accepted connections",
      };
    }
  }

  static async getAllConnections(): Promise<
    BaseResponse<ConnectionResponseData>
  > {
    try {
      const response = await apiClient.get<
        BaseResponse<ConnectionResponseData>
      >("/connections");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch connections",
      };
    }
  }

  static async acceptRequest(
    connectionId: string
  ): Promise<BaseResponse<Connection>> {
    try {
      const response = await apiClient.post<BaseResponse<Connection>>(
        `/connections/${connectionId}/accept`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to accept connection",
      };
    }
  }

  static async rejectRequest(
    connectionId: string
  ): Promise<BaseResponse<Connection>> {
    try {
      const response = await apiClient.post<BaseResponse<Connection>>(
        `/connections/${connectionId}/reject`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject connection",
      };
    }
  }

  static async cancelRequest(connectionId: string): Promise<BaseResponse> {
    try {
      await apiClient.delete(`/connections/${connectionId}/cancel`);
      return {
        success: true,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel connection",
      };
    }
  }
}
