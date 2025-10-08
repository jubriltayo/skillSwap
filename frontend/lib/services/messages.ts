import { apiClient } from "@/lib/api/client";

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
}

interface MessageResponse {
  success: boolean;
  data?: Message | Message[];
  error?: string;
}

export class MessageService {
  static async getMessages(connectionId: string): Promise<MessageResponse> {
    try {
      const response = await apiClient.get(
        `/connections/${connectionId}/messages`
      );

      if (response && response.success !== undefined) {
        return {
          success: response.success,
          data: response.data,
          error: response.error,
        };
      }

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch messages",
      };
    }
  }

  static async sendMessage(
    connectionId: string,
    message: string
  ): Promise<MessageResponse> {
    try {
      const response = await apiClient.post(
        `/connections/${connectionId}/messages`,
        {
          message,
        }
      );

      if (response && response.success !== undefined) {
        return {
          success: response.success,
          data: response.data,
          error: response.error,
        };
      }

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send message",
      };
    }
  }
}
