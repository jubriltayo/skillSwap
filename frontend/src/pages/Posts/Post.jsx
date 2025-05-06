import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import PostCard from "./PostCard";
import axiosClient from "../../api/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Paginate from "../Paginate";
import { Search } from "lucide-react";

export default function Post() {
    const [posts, setPosts] = useState([]);
    const { setNotification } = useStateContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;

    useDebounce(
        () => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page when search changes
        },
        500,
        [searchTerm]
    );

    useEffect(() => {
        getPosts();
    }, [currentPage, debouncedSearchTerm]);

    const getPosts = () => {
        setIsSearching(true);
        const endpoint = debouncedSearchTerm
            ? `/posts/search?q=${encodeURIComponent(
                  debouncedSearchTerm
              )}&page=${currentPage}&limit=${itemsPerPage}`
            : `/posts?page=${currentPage}&limit=${itemsPerPage}`;

        axiosClient
            .get(endpoint)
            .then(({ data }) => {
                setPosts(data.data || []);
                setTotalPages(data.meta?.last_page || 1);
                setTotalItems(data.meta?.total || 0);

                if (debouncedSearchTerm && data.data?.length === 0) {
                    setNotification("No matching posts found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setPosts([]);
            })
            .finally(() => setIsSearching(false));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleConnect = (postId) => {
        axiosClient
            .post(`/posts/${postId}/connections`)
            .then(() => {
                setNotification("Connection request sent!");
                getPosts(); // Refresh current page
            })
            .catch((error) => {
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Connection failed";
                setNotification(message);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="sticky top-0 z-10 border-b border-neutral-200/40 bg-gradient-to-r from-white to-white/95 shadow-sm backdrop-blur-sm dark:border-neutral-800/40 dark:from-neutral-950 dark:to-neutral-950/95">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-auto">
                        <h1 className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-neutral-400">
                            Trending Posts
                        </h1>
                    </div>
                    <div className="relative w-full sm:w-64 md:w-80">
                        <input
                            className="w-full rounded-md border border-neutral-200/50 bg-white/50 px-4 py-2 pl-10 outline-none"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search posts..."
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-neutral-500 dark:text-neutral-400" />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center p-6">
                {isSearching && posts.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                        Searching Posts...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                        {searchTerm
                            ? "No matching post found."
                            : "No posts available."}
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onConnect={() => handleConnect(post.id)}
                        />
                    ))
                )}
            </div>

            {posts.length > 0 && (
                <Paginate
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
