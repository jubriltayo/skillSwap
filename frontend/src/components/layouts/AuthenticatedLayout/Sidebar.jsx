import { Link } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import {
    Menu,
    X,
    Signpost,
    ClipboardPlus,
    NotebookPen,
    Handshake,
    User,
    Users,
    LogOut,
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
    const { user, setToken } = useStateContext();

    const handleLogout = (e) => {
        e.preventDefault();
        setToken(null);
    };

    return (
        <div
            className={`fixed h-screen bg-indigo-600 text-white flex flex-col ${
                collapsed ? "w-20" : "w-64"
            } transition-all duration-300 ease-in-out z-10`}
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <svg
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 12C4 9.79086 5.79086 8 8 8H16C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16H8C5.79086 16 4 14.2091 4 12Z"
                            fill="white"
                            fillOpacity="0.5"
                        />
                        <path
                            d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4Z"
                            fill="white"
                        />
                        <path
                            d="M12 12C14.2091 12 16 13.7909 16 16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16C8 13.7909 9.79086 12 12 12Z"
                            fill="white"
                        />
                    </svg>
                    {!collapsed && (
                        <span className="ml-2 text-xl font-semibold">
                            Skill Swap
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-white p-1 rounded-md hover:bg-indigo-700 lg:hidden"
                >
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-1 px-2 pt-4">
                    <li>
                        <Link
                            to="/posts"
                            className="relative flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <Signpost />
                            </div>
                            {!collapsed && (
                                <div className="w-full">
                                    <span>Posts</span>
                                </div>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/posts/new"
                            className="relative flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <ClipboardPlus />
                            </div>
                            {!collapsed && <span>New Post</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/user/posts"
                            className="relative flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <NotebookPen />
                            </div>
                            {!collapsed && (
                                <div className="w-full">
                                    <span>My Posts</span>
                                </div>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/connections"
                            className="relative flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <Handshake />
                            </div>
                            {!collapsed && (
                                <div className="w-full">
                                    <span>Connections</span>
                                </div>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/connections/list"
                            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <Users />
                            </div>
                            {!collapsed && <span>Contacts</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 group"
                        >
                            <div className="mr-3 text-indigo-200">
                                <User />
                            </div>
                            {!collapsed && <span>Profile</span>}
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="border-t border-indigo-700 p-4 flex items-center justify-between">
                <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-white hover:text-indigo-200"
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span className="ml-2">Log Out</span>}
                </button>
                {!collapsed && (
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                            {user.name}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
