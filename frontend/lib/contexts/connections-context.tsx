"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConnectionService } from "@/lib/services/connections";
import { UserService } from "@/lib/services/users";
import { useAuth } from "./auth-context";

interface ConnectionsContextType {
  connections: any[];
  pendingRequests: any[];
  acceptedConnections: any[];
  userConnectionCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  sendRequest: (postId: string, message?: string) => Promise<any>;
  acceptRequest: (connectionId: string) => Promise<any>;
  rejectRequest: (connectionId: string) => Promise<any>;
  cancelRequest: (connectionId: string) => Promise<any>;
  refetch: () => Promise<void>;
  getUserConnectionCount: (userId: string) => number | undefined;
  fetchUserConnectionCounts: (userIds: string[]) => Promise<void>;
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(
  undefined
);

export function ConnectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);
  const [userConnectionCounts, setUserConnectionCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [connectionsResult, pendingResult, acceptedResult] =
        await Promise.all([
          ConnectionService.getAllConnections(),
          ConnectionService.getPendingRequests(),
          ConnectionService.getAcceptedConnections(),
        ]);

      if (connectionsResult.success && connectionsResult.data) {
        const allConnections = [
          ...(connectionsResult.data.sent || []),
          ...(connectionsResult.data.received || []),
        ];
        setConnections(allConnections);
      }

      if (pendingResult.success && pendingResult.data) {
        setPendingRequests(
          Array.isArray(pendingResult.data) ? pendingResult.data : []
        );
      }

      if (acceptedResult.success && acceptedResult.data) {
        setAcceptedConnections(
          Array.isArray(acceptedResult.data) ? acceptedResult.data : []
        );
      }

      const errors = [
        connectionsResult.error,
        pendingResult.error,
        acceptedResult.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        setError(errors[0] || "Failed to load some connection data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConnectionCounts = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    try {
      const counts: Record<string, number> = {};

      // Fetch counts in parallel for better performance
      const countPromises = userIds.map(async (userId) => {
        try {
          const result = await UserService.getUserConnectionCount(userId);
          return {
            userId,
            count:
              result.success && result.data
                ? result.data.connection_count || 0
                : 0,
          };
        } catch (error) {
          return { userId, count: 0 };
        }
      });

      const results = await Promise.all(countPromises);

      results.forEach(({ userId, count }) => {
        counts[userId] = count;
      });

      setUserConnectionCounts((prev) => ({ ...prev, ...counts }));
    } catch (error) {
      console.error("Failed to fetch user connection counts:", error);
    }
  };

  const getUserConnectionCount = (userId: string): number | undefined => {
    return userConnectionCounts[userId];
  };

  useEffect(() => {
    fetchAllData();
  }, [isAuthenticated]);

  const sendRequest = async (postId: string, message?: string) => {
    const result = await ConnectionService.sendRequest(postId, message);
    if (result.success) {
      await fetchAllData();
    }
    return result;
  };

  const acceptRequest = async (connectionId: string) => {
    const result = await ConnectionService.acceptRequest(connectionId);
    if (result.success) {
      await fetchAllData();
    }
    return result;
  };

  const rejectRequest = async (connectionId: string) => {
    const result = await ConnectionService.rejectRequest(connectionId);
    if (result.success) {
      await fetchAllData();
    }
    return result;
  };

  const cancelRequest = async (connectionId: string) => {
    const result = await ConnectionService.cancelRequest(connectionId);
    if (result.success) {
      await fetchAllData();
    }
    return result;
  };

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        pendingRequests,
        acceptedConnections,
        userConnectionCounts,
        loading,
        error,
        sendRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        refetch: fetchAllData,
        getUserConnectionCount,
        fetchUserConnectionCounts,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionsContext);
  if (context === undefined) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return context;
}
