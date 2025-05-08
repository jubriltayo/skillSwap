export default function PostCard({ post, onConnect }) {
  return (
    <div className="w-64 bg-indigo-400 border border-gray-100 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="p-5 flex flex-col h-full">
        <div className="w-full flex justify-between items-center mb-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              post.type === "request"
                ? "bg-purple-100 text-purple-800"
                : "bg-emerald-100 text-emerald-800"
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
              <span className="text-xs font-medium text-green-600">Active</span>
            </span>
          ) : (
            <span className="flex items-center">
              <span className="relative flex h-2 w-2 mr-1.5 bg-gray-300 rounded-full"></span>
              <span className="text-xs font-medium text-gray-500">
                Inactive
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-90 line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-3 mb-auto">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-1.5 w-full mt-3 mb-3">
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
              {post.skill}
            </span>
            <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full ">
              {post.level}
            </span>
          </div>
        </div>

        <div className="w-full mt-auto mb-3">
          <span className="text-xs font-medium text-gray-700">
            Posted by{" "}
            <span className="font-semibold text-gray-900">
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
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
            }`}
          >
            {post.connection_status === "pending" ? "Request Sent" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
