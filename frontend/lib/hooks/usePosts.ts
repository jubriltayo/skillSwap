import { useState, useEffect, useCallback } from "react";
import { PostService } from "@/lib/services/posts";
import type {
  Post,
  CreatePostData,
  PostFilters as ApiPostFilters,
} from "@/lib/types";

interface UsePostsOptions {
  filters?: ApiPostFilters;
}

export function usePosts(options?: UsePostsOptions) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (customFilters?: ApiPostFilters) => {
      setLoading(true);
      setError(null);

      try {
        const result = await PostService.getPosts(
          customFilters || options?.filters
        );

        if (result.success && result.data) {
          setPosts(result.data);
        } else {
          setError(result.error || "Failed to load posts");
          setPosts([]);
        }
      } catch {
        setError("An unexpected error occurred");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [options?.filters]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (postData: CreatePostData) => {
    const result = await PostService.createPost(postData);
    if (result.success) {
      await fetchPosts();
    }
    return result;
  };

  const updatePost = async (id: string, postData: Partial<CreatePostData>) => {
    const result = await PostService.updatePost(id, postData);
    if (result.success) {
      await fetchPosts();
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await PostService.getUserPosts();

      if (result.success && result.data) {
        setPosts(result.data);
      } else {
        setError(result.error || "Failed to load your posts");
        setPosts([]);
      }
    } catch {
      setError("An unexpected error occurred");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchUserPosts,
  };
}
