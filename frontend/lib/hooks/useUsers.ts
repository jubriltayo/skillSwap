import { useState, useEffect } from "react";
import { UserService } from "@/lib/services/users";
import type { User } from "@/lib/types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserService.getUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setError(result.error || "Failed to fetch users");
      }
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserService.searchUsers(query);
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setError(result.error || "Failed to search users");
      }
    } catch {
      setError("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    searchUsers,
  };
}
