/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
    args: {},
    handler: async (ctx: any) => {
        // using index if possible, or just default order
        const posts = await ctx.db.query("posts").withIndex("by_createdAt").order("desc").take(50);

        // Join with users
        const postsWithUser = await Promise.all(posts.map(async (post: any) => {
            const user = await ctx.db.get(post.userId);
            return {
                ...post,
                ...post,
                // Update denormalized fields with fresh data
                username: user ? user.username : post.username,
                avatar: user ? user.avatar : post.avatar,
                // Do NOT overwrite userId with object
                userId: post.userId,
                author: user ? {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar
                } : null
            };
        }));

        return postsWithUser;
    },
});

export const createPost = mutation({
    args: {
        userId: v.id("users"),
        content: v.string(),
        image: v.optional(v.string()),
        hashtags: v.array(v.string()),
    },
    handler: async (ctx: any, args: any) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        // Create post
        const postId = await ctx.db.insert("posts", {
            userId: args.userId,
            username: user.username,
            avatar: user.avatar,
            content: args.content,
            image: args.image,
            likes: [],
            comments: [],
            hashtags: args.hashtags,
            createdAt: new Date().toISOString(),
        });

        // Update Hashtags
        for (const tag of args.hashtags) {
            const existing = await ctx.db
                .query("hashtags")
                .withIndex("by_name", (q: any) => q.eq("name", tag))
                .first();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    count: existing.count + 1,
                    updatedAt: new Date().toISOString()
                });
            } else {
                await ctx.db.insert("hashtags", {
                    name: tag,
                    count: 1,
                    updatedAt: new Date().toISOString()
                });
            }
        }

        const newPost = await ctx.db.get(postId);

        // Populate for return
        return {
            ...newPost,
            userId: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar
            }
        };
    },
});

export const searchPosts = query({
    args: { query: v.string() },
    handler: async (ctx: any, args: any) => {
        const posts = await ctx.db.query("posts").take(100);
        const q = args.query.toLowerCase();

        const filtered = posts.filter((p: any) =>
            p.content.toLowerCase().includes(q) ||
            p.hashtags.some((t: any) => t.toLowerCase().includes(q))
        ).slice(0, 20);

        // Join with users
        return await Promise.all(filtered.map(async (post: any) => {
            const user = await ctx.db.get(post.userId);
            return {
                ...post,
                // Update denormalized fields
                username: user ? user.username : post.username,
                avatar: user ? user.avatar : post.avatar,
                userId: post.userId,
                author: user ? {
                    _id: user._id, // Convex ID
                    username: user.username,
                    avatar: user.avatar
                } : null
            };
        }));
    }
});

// Like/Unlike a post
export const toggleLike = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx: any, args: any) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Not authenticated");

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        const userIdStr = userId.subject as any;
        const isLiked = post.likes.includes(userIdStr);

        if (isLiked) {
            await ctx.db.patch(args.postId, {
                likes: post.likes.filter((id: any) => id !== userIdStr),
            });
        } else {
            await ctx.db.patch(args.postId, {
                likes: [...post.likes, userIdStr],
            });
        }

        return { isLiked: !isLiked };
    },
});

// Add comment to a post
export const addComment = mutation({
    args: {
        postId: v.id("posts"),
        text: v.string(),
    },
    handler: async (ctx: any, args: any) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Not authenticated");

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        const userIdStr = userId.subject as any;
        const user = await ctx.db.get(userIdStr);
        if (!user) throw new Error("User not found");

        const newComment = {
            userId: userIdStr,
            username: user.username,
            text: args.text,
            createdAt: new Date().toISOString(),
        };

        await ctx.db.patch(args.postId, {
            comments: [...post.comments, newComment],
        });

        return newComment;
    },
});
