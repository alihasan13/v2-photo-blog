'use client'


import React, {useState,useEffect} from "react";
import PostModal from "../components/PostModal";


const BlogsPage = () => {
    // State for posts, users, filtered posts, loading status, selected post, and filter
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState("all");
    const [likes, setLikes] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedLikes = localStorage.getItem('blogLikes');
            return savedLikes ? JSON.parse(savedLikes) : {};
        }
        return {};
    });

    // Fetch initial posts and users
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [postsRes, usersRes] = await Promise.all([
                    fetch("https://jsonplaceholder.typicode.com/posts"),
                    fetch("https://jsonplaceholder.typicode.com/users"),
                ]);
                const postsData = await postsRes.json();
                const usersData = await usersRes.json();
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});

                setPosts(postsData);
                setFilteredPosts(postsData);
                setUsers(usersMap);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    // Effect to save likes to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('blogLikes', JSON.stringify(likes));
        }
    }, [likes]);

    // Handle user filter change
    useEffect(() => {
        if (selectedUser === "all") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter(post => post.userId === parseInt(selectedUser)));
        }
    }, [selectedUser, posts]);

    // Handle clicking on a blog post
    const handlePostClick = async (post) => {
        setSelectedPost(post);
        setIsCommentsLoading(true);
        try {
            const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
            const commentsData = await commentsRes.json();
            setComments(commentsData);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsCommentsLoading(false);
        }
    };

    // Close the post modal
    const handleCloseModal = () => {
        setSelectedPost(null);
        setComments([]);
    };

    // Handle liking a post
    const handleLike = (postId, e) => {
        e.stopPropagation(); // Prevent modal from opening
        setLikes(prevLikes => ({
            ...prevLikes,
            [postId]: !prevLikes[postId]
        }));
    };

    // Render skeleton loaders for blog posts
    const renderPostSkeletons = () => {
        return Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        ));
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Blogs</h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="user-filter" className="text-sm font-medium text-gray-700">Filter by Author:</label>
                    <select
                        id="user-filter"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-gray-700 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Authors</option>
                        {Object.values(users).map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                 <div className="space-y-6">{renderPostSkeletons()}</div>
            ) : (
                <div className="space-y-6">
                    {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                        <div key={post.id} onClick={() => handlePostClick(post)} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{post.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">by {users[post.userId]?.name || "Unknown"}</p>
                                </div>
                                <button onClick={(e) => handleLike(post.id, e)} className={`flex items-center space-x-1 text-sm font-medium p-2 rounded-full transition-colors ${likes[post.id] ? 'text-red-500 bg-red-100' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    <svg className={`w-5 h-5 ${likes[post.id] ? 'fill-current' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-700">{post.body.substring(0, 100)}...</p>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No posts found for this author.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedPost && (
                <PostModal
                    post={selectedPost}
                    author={users[selectedPost.userId]}
                    comments={comments}
                    isLoading={isCommentsLoading}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};
export default BlogsPage
