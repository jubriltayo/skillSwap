import { useState, useEffect } from "react";
import { ConnectionService } from "@/lib/services/connections";

export function useConnections() {
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [connectionsResult, pendingResult, acceptedResult] =
        await Promise.all([
          ConnectionService.getAllConnections(),
          ConnectionService.getPendingRequests(),
          ConnectionService.getAcceptedConnections(),
        ]);

      // Handle connections response (combine sent and received)
      if (connectionsResult.success && connectionsResult.data) {
        const allConnections = [
          ...(connectionsResult.data.sent || []),
          ...(connectionsResult.data.received || []),
        ];
        setConnections(allConnections);
      }

      // Handle pending requests
      if (pendingResult.success && pendingResult.data) {
        setPendingRequests(
          Array.isArray(pendingResult.data) ? pendingResult.data : []
        );
      }

      // Handle accepted connections
      if (acceptedResult.success && acceptedResult.data) {
        setAcceptedConnections(
          Array.isArray(acceptedResult.data) ? acceptedResult.data : []
        );
      }

      // Check for any errors
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

  useEffect(() => {
    fetchAllData();
  }, []);

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

  return {
    connections,
    pendingRequests,
    acceptedConnections,
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    refetch: fetchAllData,
  };
}
