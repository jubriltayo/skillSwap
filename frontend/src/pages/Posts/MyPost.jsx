import { useEffect, useState } from "react";
import MyPostCard from "./MyPostCard";
import axiosClient from "../../api/axios-client";

export default function MyPost() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = () => {
        axiosClient
            .get("/user/posts")
            .then(({ data }) => {
                setPosts(data.data);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    };

    const handleDelete = (postId) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    return (
        <>
            <div>
                <h1
                    className="text-2xl font-bold text-gray-800 mb-4 px-8 py-4 border-b border-gray-300
                "
                >
                    My Posts
                </h1>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {posts.length === 0 ? (
                    <p>You have no post</p>
                ) : (
                    posts.map((post) => (
                        <MyPostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </>
    );
}
