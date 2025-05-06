import { useEffect, useState } from "react";
import ConnectionCard from "./ConnectionCard";
import axiosClient from "../../api/axios-client";

export default function Connection() {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingConnections();
    }, []);

    const fetchPendingConnections = () => {
        axiosClient
            .get("/connections/pending")
            .then(({ data }) => {
                setConnections(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching pending connections:", error);
                setLoading(false);
            });
    };

    const handleAccept = (connectionId) => {
        axiosClient
            .post(`/connections/${connectionId}/accept`)
            .then(() => {
                // remove the accepted connection from the list
                setConnections((prevConnections) =>
                    prevConnections.filter(
                        (connection) => connection.id !== connectionId
                    )
                );
            })
            .catch((error) => {
                console.error("Error accepting connection:", error);
            });
    };

    const handleReject = (connectionId) => {
        axiosClient
            .post(`/connections/${connectionId}/reject`)
            .then(() => {
                // remove the rejected connection from the list
                setConnections((prevConnections) =>
                    prevConnections.filter(
                        (connection) => connection.id !== connectionId
                    )
                );
            })
            .catch((error) => {
                console.error("Error rejecting connection:", error);
            });
    };

    if (loading)
        return (
            <div className="container mx-auto p-4">Loading connection requests...</div>
        );
    return (
        <>
            <div>
                <h1
                    className="text-2xl font-bold text-gray-800 mb-4 px-8 py-4 border-b border-gray-300
                "
                >
                    Connection Requests
                </h1>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {connections.length === 0 ? (
                    <p>No pending connection requests</p>
                ) : (
                    connections.map((connection) => (
                        <ConnectionCard
                            key={connection.id}
                            connection={connection}
                            onAccept={() => handleAccept(connection.id)}
                            onReject={() => handleReject(connection.id)}
                        />
                    ))
                )}
            </div>
        </>
    );
}
