/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByUsername = query({
    args: { username: v.string() },

    handler: async (ctx: any, args: any) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q: any) => q.eq("username", args.username))
            .first();
        return user;
    },
});

export const getUser = query({
    args: { id: v.id("users") },
    handler: async (ctx: any, args: any) => {
        return await ctx.db.get(args.id);
    },
});

export const createUser = mutation({
    args: {
        username: v.string(),
        email: v.string(),
        password: v.string(),
        avatar: v.string(),
    },
    handler: async (ctx: any, args: any) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_username", (q: any) => q.eq("username", args.username))
            .first();

        if (existing) {
            throw new Error("Username already exists");
        }

        const userId = await ctx.db.insert("users", {
            username: args.username,
            email: args.email,
            password: args.password,
            avatar: args.avatar,
            bio: "",
            followers: [],
            following: [],
            createdAt: new Date().toISOString(),
        });

        return await ctx.db.get(userId);
    },
});

export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        username: v.optional(v.string()),
        bio: v.optional(v.string()),
        website: v.optional(v.string()),
        pronouns: v.optional(v.string()),
        avatar: v.optional(v.string()),
        isPrivate: v.optional(v.boolean()),
    },
    handler: async (ctx: any, args: any) => {
        const { userId, ...updates } = args;
        // Check local uniqueness if username changes? (Optional)
        if (updates.username) {
            const existing = await ctx.db
                .query("users")
                .withIndex("by_username", (q: any) => q.eq("username", updates.username))
                .first();
            if (existing && existing._id !== userId) {
                throw new Error("Username taken");
            }
        }
        await ctx.db.patch(userId, updates);
    },
});

export const searchUsers = query({
    args: { query: v.string() },
    handler: async (ctx: any, args: any) => {
        const users = await ctx.db.query("users").take(100);
        const q = args.query.toLowerCase();

        return users.filter((u: any) =>
            u.username.toLowerCase().includes(q) ||
            u.bio.toLowerCase().includes(q)
        ).slice(0, 10);
    },
});

export const toggleFollow = mutation({
    args: {
        userId: v.id("users"),
        targetUserId: v.id("users"),
    },
    handler: async (ctx: any, args: any) => {
        const user = await ctx.db.get(args.userId);
        const targetUser = await ctx.db.get(args.targetUserId);

        if (!user || !targetUser) {
            throw new Error("User not found");
        }

        const isFollowing = user.following.includes(args.targetUserId);

        if (isFollowing) {
            // Unfollow
            const newFollowing = user.following.filter((id: string) => id !== args.targetUserId);
            const newFollowers = targetUser.followers.filter((id: string) => id !== args.userId);

            await ctx.db.patch(args.userId, { following: newFollowing });
            await ctx.db.patch(args.targetUserId, { followers: newFollowers });
        } else {
            // Follow
            const newFollowing = [...user.following, args.targetUserId];
            const newFollowers = [...targetUser.followers, args.userId];

            await ctx.db.patch(args.userId, { following: newFollowing });
            await ctx.db.patch(args.targetUserId, { followers: newFollowers });
        }
    },
});
