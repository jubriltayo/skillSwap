import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import Sidebar from "./Sidebar";

export default function AuthenticatedLayout() {
    const { token, notification } = useStateContext();
    const [collapsed, setCollapsed] = useState(false);

    if (!token) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <>
            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white shadow-md rounded-lg px-4 py-2 w-fit">
                    {notification}
                </div>
            )}

            <div className="flex">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main
                    className={`flex-1 transition-all duration-300 ease-in-out ${
                        collapsed ? "ml-20" : "ml-64"
                    }`}
                >
                    <Outlet />
                </main>
            </div>
        </>
    );
}
