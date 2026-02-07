/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
    args: {
        currentUserId: v.id("users"),
        otherUserId: v.id("users"),
    },
    handler: async (ctx: any, args: any) => {
        // Fetch messages between two users
        // Since we don't have a sophisticated OR query in simple filter without complex index,
        // we might fetch by recipient or sender and filter.
        // Better: two queries.

        const sent = await ctx.db
            .query("messages")
            .withIndex("by_sender_recipient", (q: any) =>
                q.eq("senderId", args.currentUserId).eq("recipientId", args.otherUserId)
            )
            .collect();

        const received = await ctx.db
            .query("messages")
            .withIndex("by_sender_recipient", (q: any) =>
                q.eq("senderId", args.otherUserId).eq("recipientId", args.currentUserId)
            )
            .collect();

        const allMessages = [...sent, ...received];

        // Sort by time
        return allMessages.sort((a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    },
});

export const getConversations = query({
    args: { userId: v.id("users") },
    handler: async (ctx: any, args: any) => {
        // This is complex in non-relational without a separate "conversations" table.
        // We find all messages involving the user, then group by the other party.
        // Optimization: Create a 'conversations' table in future.
        // For now, scan messages where user is recipient.

        const received = await ctx.db
            .query("messages")
            .withIndex("by_recipient", (q: any) => q.eq("recipientId", args.userId))
            .collect();

        // We also need sent messages to find conversations where we started it
        // This scan might be expensive if many messages.
        const sent = await ctx.db
            .query("messages")
            .filter((q: any) => q.eq(q.field("senderId"), args.userId))
            .collect();

        const all = [...received, ...sent];
        const map = new Map();

        for (const m of all) {
            const otherId = m.senderId === args.userId ? m.recipientId : m.senderId;
            if (!map.has(otherId)) {
                map.set(otherId, m);
            } else {
                // Keep latest
                const current = map.get(otherId);
                if (new Date(m.createdAt) > new Date(current.createdAt)) {
                    map.set(otherId, m);
                }
            }
        }

        const conversations = [];
        for (const [otherId, lastMessage] of map.entries()) {
            const user = await ctx.db.get(otherId);
            if (user) {
                conversations.push({
                    user: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar
                    },
                    lastMessage: {
                        text: lastMessage.text || "Sent an image",
                        createdAt: lastMessage.createdAt,
                        isRead: lastMessage.read
                    }
                });
            }
        }

        return conversations.sort((a, b) =>
            new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
        );
    }
});

export const sendMessage = mutation({
    args: {
        senderId: v.id("users"),
        recipientId: v.id("users"),
        text: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx: any, args: any) => {
        return await ctx.db.insert("messages", {
            senderId: args.senderId,
            recipientId: args.recipientId,
            text: args.text,
            image: args.image,
            read: false,
            createdAt: new Date().toISOString(),
        });
    },
});

export const markRead = mutation({
    args: { messageIds: v.array(v.id("messages")) },
    handler: async (ctx: any, args: any) => {
        for (const id of args.messageIds) {
            await ctx.db.patch(id, { read: true });
        }  
    }
});
