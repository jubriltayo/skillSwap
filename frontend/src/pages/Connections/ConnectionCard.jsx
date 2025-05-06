export default function ConnectionCard({ connection, onAccept, onReject }) {
    return (
        <div className="bg-blue-50 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-700/30">
            <div className="p-4 flex flex-col">
                <h3 className="text-m font-semibold text-gray-900 dark:text-white pb-2">
                    {connection.sender?.name || "User"}{" "}
                    <span className="text-xs font-normal text-gray-600">
                        wants to connect
                    </span>
                </h3>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                    <span className="text-s font-semibold">About Post:</span>{" "}
                    {connection.post?.title || "Post"}
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                    <span className="text-s font-semibold">
                        Offered Skills:{" "}
                    </span>{" "}
                    {connection.sender?.skills_offered || connection.post?.description || "None"}
                </p>

                <div className="mt-3 flex justify-between space-x-2">
                    <button
                        onClick={onAccept}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        onClick={onReject}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}
