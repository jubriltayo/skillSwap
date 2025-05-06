import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios-client";
import { useStateContext } from "../../context/ContextProvider";

export default function MyPostCard({ post, onDelete }) {
    const navigate = useNavigate();
    const { setNotification } = useStateContext();

    const handleEdit = () => {
        navigate(`/posts/${post.id}`);
    };

    const handleDelete = () => {
        axiosClient
            .delete(`posts/${post.id}`)
            .then(() => {
                setNotification("Post deleted successfully")
                onDelete(post.id);
            })
            .catch((error) => {
                console.error("Delete error: ", error);
            });
    };

    return (
        <div className="w-64 bg-blue-50 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-700/30">
            <div className="p-4 flex flex-col items-center text-center">
                <div className="w-full flex justify-between items-center mb-3">
                    <span
                        className={`text-xs px-2 py-1 rounded ${
                            post.type === "request"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        }`}
                    >
                        {post.type === "request" ? "Seeking" : "Offering"}
                    </span>

                    {post.isActive ? (
                        <span className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400">
                                Active
                            </span>
                        </span>
                    ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Inactive
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 w-full">
                    {post.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mt-2">
                    {post.description}
                </p>

                <div className="mt-3 flex justify-center flex-wrap gap-1 w-full">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                        {post.skill}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded dark:bg-amber-900 dark:text-amber-200">
                        {post.level}
                    </span>
                </div>

                <div className="mt-2 flex justify-between space-x-2 w-full">
                    <button
                        onClick={handleEdit}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-xs text-white  bg-red-500 dark:text-gray-300 px-3 py-1.5 rounded hover:bg-red-700 dark:hover:bg-gray-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
