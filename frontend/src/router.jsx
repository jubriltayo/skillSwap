import { createBrowserRouter } from "react-router-dom";
import AuthenticatedLayout from "./components/layouts/AuthenticatedLayout";
import GuestLayout from "./components/layouts/GuestLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import NotFound from "./pages/NotFound";
import Posts from "./pages/Posts/Post";
import MyPost from "./pages/Posts/MyPost";
import PostForm from "./pages/Posts/PostForm";
import UserForm from "./pages/Users/UserForm";
import Connection from "./pages/Connections/Connection";
import ConnectionList from "./pages/Connections/ConnectionList";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticatedLayout />,
        children: [
            {
                index: true,
                element: <Posts />,
            },
            {
                path: "posts",
                children: [
                    {
                        index: true,
                        element: <Posts />,
                    },
                    {
                        path: "new",
                        element: <PostForm />,
                    },
                    {
                        path: ":id",
                        element: <PostForm />,
                    },
                ]
            },
            {
                path: "user/posts",
                element: <MyPost />,
            },
            {
                path: "connections",
                children: [
                    {
                        index: true,
                        element: <Connection />,
                    },
                    {
                        path: "list",
                        element: <ConnectionList />,
                    }
                ]
            },
            {
                path: "profile",
                element: <UserForm />,
            },
        ],
    },
    {
        path: "/auth",
        element: <GuestLayout />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
