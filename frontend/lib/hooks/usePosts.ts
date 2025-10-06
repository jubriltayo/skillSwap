import { useState, useEffect } from "react";
import { PostService } from "@/lib/services/posts";

interface PostFilters {
  type?: "offer" | "request";
  category?: string;
  skills?: string[];
  location?: string;
  is_remote?: boolean;
  experience_level?: string;
}

export function usePosts(filters?: PostFilters) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (customFilters?: PostFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await PostService.getPosts(customFilters || filters);

      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || "Failed to load posts");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (postData: any) => {
    const result = await PostService.createPost(postData);
    if (result.success) {
      await fetchPosts(); // Refresh the list
    }
    return result;
  };

  const updatePost = async (id: string, postData: any) => {
    const result = await PostService.updatePost(id, postData);
    if (result.success) {
      await fetchPosts(); // Refresh the list
    }
    return result;
  };

  const deletePost = async (id: string) => {
    const result = await PostService.deletePost(id);
    if (result.success) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
    return result;
  };

  const searchPosts = async (query: string) => {
    const result = await PostService.searchPosts(query);
    return result;
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    refetch: () => fetchPosts(),
  };
}

export function useUserPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await PostService.getUserPosts();

      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || "Failed to load your posts");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    refetch: fetchUserPosts,
  };
}
