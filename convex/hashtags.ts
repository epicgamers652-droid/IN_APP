/* eslint-disable @typescript-eslint/no-explicit-any */
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTrending = query({
    args: {},
    handler: async (ctx: any) => {
        return await ctx.db.query("hashtags")
            .withIndex("by_count")
            .order("desc")
            .take(10);
    },
});

export const searchHashtags = query({
    args: { query: v.string() },
    handler: async (ctx: any, args: any) => {
        const q = args.query.toLowerCase();
        const tags = await ctx.db.query("hashtags").take(100);
        return tags.filter((t: any) => t.name.toLowerCase().includes(q))
            .sort((a: any, b: any) => b.count - a.count) // Sort by popularity
            .slice(0, 10);
    }
});
