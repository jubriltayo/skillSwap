export default function PostCard({ post, onConnect }) {
    return (
        <div className="w-64 bg-blue-50 border border-gray-100 rounded-xl shadow-sm dark:bg-gray-800/90 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] dark:hover:shadow-gray-700/20">
            <div className="p-5 flex flex-col h-full">
                <div className="w-full flex justify-between items-center mb-3">
                    <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            post.type === "request"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                        }`}
                    >
                        {post.type === "request" ? "Seeking" : "Offering"}
                    </span>

                    {post.isActive ? (
                        <span className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                Active
                            </span>
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-1.5 bg-gray-300 rounded-full dark:bg-gray-600"></span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Inactive
                            </span>
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-auto">
                        {post.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 w-full mt-3 mb-3">
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full dark:bg-blue-900/40 dark:text-blue-200">
                            {post.skill}
                        </span>
                        <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full dark:bg-amber-900/40 dark:text-amber-200">
                            {post.level}
                        </span>
                    </div>
                </div>

                <div className="w-full mt-auto mb-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Posted by{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {post.user.name}
                        </span>
                    </span>
                </div>

                <div className="w-full mt-auto">
                    <button
                        onClick={onConnect}
                        disabled={post.connection_status}
                        className={`w-full text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                            post.connection_status
                                ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                        }`}
                    >
                        {post.connection_status === "pending"
                            ? "Request Sent"
                            : "Connect"}
                    </button>
                </div>
            </div>
        </div>
    );
}
