import { ConvexHttpClient } from "convex/browser";

const NEXT_PUBLIC_CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!NEXT_PUBLIC_CONVEX_URL) {
    console.error("Warning: NEXT_PUBLIC_CONVEX_URL is not defined in environment variables.");
}

export const convex = new ConvexHttpClient(NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url.convex.cloud");
