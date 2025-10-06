import { useState, useEffect } from "react";
import { UserService } from "@/lib/services/users";
import type { User } from "@/lib/types/database";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await UserService.getUsers();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.error || "Failed to load users");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching users:", err);
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
  };
}
