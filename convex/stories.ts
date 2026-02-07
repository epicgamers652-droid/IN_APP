/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStories = query({
    args: {},
    handler: async (ctx: any) => {
        // Get valid stories (not expired)
        const now = new Date().toISOString();
        const stories = await ctx.db.query("stories")
            .withIndex("by_expiresAt", (q: any) => q.gt("expiresAt", now))
            .collect();

        // Group by user
        const grouped = new Map();

        for (const story of stories) {
            if (!grouped.has(story.userId)) {
                grouped.set(story.userId, {
                    userId: story.userId,
                    username: story.username,
                    avatar: story.avatar,
                    stories: []
                });
            }
            grouped.get(story.userId).stories.push(story);
        }

        return Array.from(grouped.values());
    }
});

export const createStory = mutation({
    args: {
        userId: v.id("users"),
        username: v.string(),
        avatar: v.string(),
        image: v.string(),
    },
    handler: async (ctx: any, args: any) => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

        return await ctx.db.insert("stories", {
            userId: args.userId,
            username: args.username,
            avatar: args.avatar,
            image: args.image,
            views: [],
            createdAt: now.toISOString(),
            expiresAt: expiresAt,
        });
    }
});

export const viewStory = mutation({
    args: {
        storyId: v.id("stories"),
        userId: v.id("users"),
    },
    handler: async (ctx: any, args: any) => {
        const story = await ctx.db.get(args.storyId);
        if (!story) return;

        if (!story.views.includes(args.userId)) {
            await ctx.db.patch(args.storyId, {
                views: [...story.views, args.userId]
            });
        }
    }
});
