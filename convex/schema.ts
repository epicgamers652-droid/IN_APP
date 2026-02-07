import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        email: v.string(),
        password: v.string(),
        avatar: v.string(),
        bio: v.string(),
        followers: v.array(v.id("users")),
        following: v.array(v.id("users")),
        createdAt: v.string(),
        // Optional fields
        website: v.optional(v.string()),
        pronouns: v.optional(v.string()),
        // Optional fields seen in api/auth/route.ts
        isPrivate: v.optional(v.boolean()),
        blockedUsers: v.optional(v.array(v.id("users"))),
        followRequests: v.optional(v.array(v.id("users"))),
        postsCount: v.optional(v.number()),
    })
        .index("by_username", ["username"])
        .index("by_email", ["email"]),

    posts: defineTable({
        userId: v.id("users"),
        username: v.string(),
        avatar: v.string(),
        content: v.string(),
        image: v.optional(v.string()),
        likes: v.array(v.id("users")),
        comments: v.array(v.object({
            userId: v.optional(v.id("users")),
            username: v.optional(v.string()),
            text: v.optional(v.string()),
            createdAt: v.string(),
        })),
        hashtags: v.array(v.string()),
        createdAt: v.string(),
    })
        .index("by_userId", ["userId"])
        .index("by_createdAt", ["createdAt"]), // for fetching latest posts

    hashtags: defineTable({
        name: v.string(),
        count: v.number(),
        updatedAt: v.string(),
    }).index("by_name", ["name"])
        .index("by_count", ["count"]), // for trending

    stories: defineTable({
        userId: v.id("users"),
        username: v.string(),
        avatar: v.string(),
        image: v.string(),
        views: v.array(v.id("users")),
        expiresAt: v.string(),
        createdAt: v.string(),
    }).index("by_expiresAt", ["expiresAt"]),

    messages: defineTable({
        senderId: v.id("users"),
        recipientId: v.id("users"),
        text: v.optional(v.string()),
        image: v.optional(v.string()),
        read: v.boolean(),
        createdAt: v.string(),
    }).index("by_recipient", ["recipientId"])
        .index("by_sender_recipient", ["senderId", "recipientId"]),
});
