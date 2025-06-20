'use client'
import { useState,useEffect } from "react";
import ModalLayout from './ModalLayout'


const PostModal = ({ post, author, onClose }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!post?.id) return;
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [post.id]);

    const renderCommentSkeletons = () => {
        return Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="py-4 border-b border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
        ));
    };

    return (
        <ModalLayout title={post.title} subtitle={`by ${author?.name || "Unknown"}`} onClose={onClose}>
             <p className="text-gray-800 whitespace-pre-wrap">{post.body}</p>
            <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Comments</h4>
                {isLoading ? (
                    <div className="space-y-4">{renderCommentSkeletons()}</div>
                ) : (
                    <div className="space-y-4">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="py-4 border-b border-gray-100 last:border-b-0">
                                <p className="font-semibold text-sm text-gray-800">{comment.name} ({comment.email})</p>
                                <p className="text-gray-600 mt-1">{comment.body}</p>
                            </div>
                        )) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                )}
            </div>
        </ModalLayout>
    );
};

export default PostModal
