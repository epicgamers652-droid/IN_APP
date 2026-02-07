'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '@/store/store';

export default function Feed() {
  const { posts, currentUser, deletePost, setPosts } = useStore();
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [commentLikes, setCommentLikes] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [setPosts]);

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const toggleSavePost = (postId: string) => {
    setSavedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleExpandComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  return (
    <div className="space-y-6 pb-8">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar || 'https://i.pravatar.cc/150?img=1'}
                  alt={post.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-black dark:text-white">
                    {post.username || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {post.createdAt
                      ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                      : 'Just now'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition">
                  <MoreHorizontal size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
                {currentUser?.id === post.userId && (
                  <button
                    onClick={() => {
                      if (post._id) deletePost(post._id);
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full object-cover max-h-96"
              />
            )}

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex gap-2 mb-4 text-gray-800 dark:text-gray-200">
                <button
                  onClick={() => toggleLike(post._id)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition ${likedPosts.has(post._id) ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Heart
                    size={24}
                    fill={likedPosts.has(post._id) ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  onClick={() => toggleExpandComments(post._id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition text-gray-700 dark:text-gray-300"
                >
                  <MessageCircle size={24} strokeWidth={1.5} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition text-gray-700 dark:text-gray-300">
                  <Share2 size={24} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => toggleSavePost(post._id)}
                  className={`ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition ${savedPosts.includes(post._id)
                    ? 'text-black dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Bookmark
                    size={24}
                    fill={savedPosts.includes(post._id) ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Likes Count */}
              <p className="font-semibold text-sm text-black dark:text-white mb-3">
                {(post.likes?.length || 0) + (likedPosts.has(post._id) ? 1 : 0)}{' '}
                {(post.likes?.length || 0) + (likedPosts.has(post._id) ? 1 : 0) === 1
                  ? 'like'
                  : 'likes'}
              </p>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-black dark:text-white">
                  <span className="font-semibold mr-2">{post.username}</span>
                  {post.content}
                </p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.hashtags.map((tag: string) => (
                      <a
                        key={tag}
                        href="#"
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Toggle */}
              {post.comments && post.comments.length > 0 && !expandedComments.has(post._id) && (
                <button
                  onClick={() => toggleExpandComments(post._id)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-3 font-medium transition"
                >
                  View all {post.comments.length}{' '}
                  {post.comments.length === 1 ? 'comment' : 'comments'}
                </button>
              )}
            </div>

            {/* Comments Section */}
            {expandedComments.has(post._id) && (
              <>
                {post.comments && post.comments.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-3 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900/30">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="text-sm flex gap-2 group">
                        <img
                          src={comment.avatar || 'https://i.pravatar.cc/150'}
                          alt={comment.username}
                          className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-black dark:text-white">
                            {comment.username}
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 ml-2">
                            {comment.text}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newLikes = new Set(commentLikes);
                            if (newLikes.has(comment.id)) {
                              newLikes.delete(comment.id);
                            } else {
                              newLikes.add(comment.id);
                            }
                            setCommentLikes(newLikes);
                          }}
                          className={`opacity-0 group-hover:opacity-100 transition flex-shrink-0 ${commentLikes.has(comment.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                            }`}
                        >
                          <Heart
                            size={14}
                            fill={commentLikes.has(comment.id) ? 'currentColor' : 'none'}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                {currentUser && (
                  <div className="border-t border-gray-200 dark:border-gray-800 flex gap-2 p-4 bg-gray-50 dark:bg-gray-900/30">
                    <img
                      src={currentUser.avatar || 'https://i.pravatar.cc/150'}
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [post._id]: e.target.value,
                          })
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentText[post._id]?.trim()) {
                            setCommentText({
                              ...commentText,
                              [post._id]: '',
                            });
                          }
                        }}
                        className="flex-1 bg-transparent text-black dark:text-white text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        onClick={() => {
                          if (commentText[post._id]?.trim()) {
                            setCommentText({
                              ...commentText,
                              [post._id]: '',
                            });
                          }
                        }}
                        className="text-blue-500 hover:text-blue-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!commentText[post._id]?.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Follow users to see their posts
          </p>
        </div>
      )}
    </div>
  );
}
