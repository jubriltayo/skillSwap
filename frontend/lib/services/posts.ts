import { apiClient } from "@/lib/api/client";
import type {
  Post,
  BaseResponse,
  PaginatedResponse,
  PostFilters,
  CreatePostData
} from "@/lib/types";

export class PostService {
  static async getPosts(filters?: PostFilters): Promise<BaseResponse<Post[]>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Post>>(
        "/posts",
        filters
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
        data: Array.isArray(response) ? response : [],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      };
    }
  }

  static async getPost(id: string): Promise<BaseResponse<Post>> {
    try {
      const response = await apiClient.get<BaseResponse<Post>>(`/posts/${id}`);

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as Post,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch post",
      };
    }
  }

  static async createPost(
    postData: CreatePostData
  ): Promise<BaseResponse<Post>> {
    try {
      const response = await apiClient.post<BaseResponse<Post>>(
        "/posts",
        postData
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as Post,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create post",
      };
    }
  }

  static async updatePost(
    id: string,
    postData: Partial<Post>
  ): Promise<BaseResponse<Post>> {
    try {
      const response = await apiClient.put<BaseResponse<Post>>(
        `/posts/${id}`,
        postData
      );

      if (response && response.success !== undefined) {
        return response;
      }

      return {
        success: true,
        data: response as unknown as Post,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update post",
      };
    }
  }

  static async deletePost(id: string): Promise<BaseResponse> {
    try {
      await apiClient.delete(`/posts/${id}`);
      return {
        success: true,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete post",
      };
    }
  }

  static async searchPosts(query: string): Promise<BaseResponse<Post[]>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Post>>(
        `/posts/search?q=${encodeURIComponent(query)}`
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
        data: Array.isArray(response) ? response : [],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to search posts",
      };
    }
  }

  static async getUserPosts(): Promise<BaseResponse<Post[]>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Post>>(
        "/user/posts"
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
        data: Array.isArray(response) ? response : [],
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch user posts",
      };
    }
  }
}
