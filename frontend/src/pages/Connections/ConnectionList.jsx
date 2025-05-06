import { useEffect, useState } from "react";
import axiosClient from "../../api/axios-client";
import { InformationCircleIcon } from "@heroicons/react/20/solid";


export default function ConnectionList() {
    const [activeTab, setActiveTab] = useState("sent");
    const [sentConnections, setSentConnections] = useState([]);
    const [receivedConnections, setReceivedConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getConnectionsList();
    }, []);

    const getConnectionsList = () => {
        axiosClient
            .get("/connections")
            .then(({ data }) => {
                setSentConnections(data.sent);
                setReceivedConnections(data.received);
            })
            .catch((error) => {
                console.error("Error fetching connections:", error);
            })
            .finally(() => setLoading(false));
    };

    const handleContact = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const renderConnectionRow = (connection) => {
        const user =
            activeTab === "sent" ? connection.receiver : connection.sender;
        const post = connection.post;

        return (
            <tr key={connection.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">
                    {user?.name || "Unknown User"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {post?.title || "No title"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {post?.type === "offer" ? "Offering" : "Seeking"}{" "}
                            {post?.skill}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {post?.level}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                    <button
                        onClick={() => handleContact(user?.email)}
                        className="hover:text-blue-800"
                    >
                        Contact
                    </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {user?.skills_offered}
                </td>
            </tr>
        );
    };

    if (loading)
        return (
            <div className="container mx-auto p-4">Loading connections...</div>
        );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Connections List</h1>
                <p className="text-gray-600">
                    Manage your professional network
                </p>
            </div>

            <div className="flex border-b border-b-gray-400 mb-6">
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === "sent"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("sent")}
                >
                    Sent Connections ({sentConnections.length})
                </button>
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === "received"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("received")}
                >
                    Received Connections ({receivedConnections.length})
                </button>
            </div>

            <div className="rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Post Details
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Skill Level
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Actions
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                Offered Skills
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {activeTab === "sent" ? (
                            sentConnections.length > 0 ? (
                                sentConnections.map(renderConnectionRow)
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No sent connections found
                                    </td>
                                </tr>
                            )
                        ) : receivedConnections.length > 0 ? (
                            receivedConnections.map(renderConnectionRow)
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No received connections found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
