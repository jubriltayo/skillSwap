import { apiClient } from "@/lib/api/client";

interface PostResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class PostService {
  static async getPosts(filters?: any): Promise<PostResponse> {
    try {
      const response = await apiClient.get("/posts", filters);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch posts",
      };
    }
  }

  static async getPost(id: string): Promise<PostResponse> {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch post",
      };
    }
  }

  static async createPost(postData: any): Promise<PostResponse> {
    try {
      const response = await apiClient.post("/posts", postData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create post",
      };
    }
  }

  static async updatePost(id: string, postData: any): Promise<PostResponse> {
    try {
      const response = await apiClient.put(`/posts/${id}`, postData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update post",
      };
    }
  }

  static async deletePost(id: string): Promise<PostResponse> {
    try {
      await apiClient.delete(`/posts/${id}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete post",
      };
    }
  }

  static async searchPosts(query: string): Promise<PostResponse> {
    try {
      const response = await apiClient.get(
        `/posts/search?q=${encodeURIComponent(query)}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to search posts",
      };
    }
  }

  static async getUserPosts(): Promise<PostResponse> {
    try {
      const response = await apiClient.get("/user/posts");
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch user posts",
      };
    }
  }
}
