import { apiClient } from "@/lib/api/client";
import type { Message, BaseResponse } from "@/lib/types";

export class MessageService {
  static async getMessages(
    connectionId: string
  ): Promise<BaseResponse<Message[]>> {
    try {
      const response = await apiClient.get<BaseResponse<Message[]>>(
        `/connections/${connectionId}/messages`
      );

      if (response && typeof response === "object" && "success" in response) {
        return response as BaseResponse<Message[]>;
      }

      return {
        success: true,
        data: response as unknown as Message[],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
      };
    }
  }

  static async sendMessage(
    connectionId: string,
    message: string
  ): Promise<BaseResponse<Message>> {
    try {
      const response = await apiClient.post<BaseResponse<Message>>(
        `/connections/${connectionId}/messages`,
        {
          message,
        }
      );

      if (response && typeof response === "object" && "success" in response) {
        return response as BaseResponse<Message>;
      }

      return {
        success: true,
        data: response as unknown as Message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send message",
      };
    }
  }
}
