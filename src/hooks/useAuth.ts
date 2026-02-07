"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";

export function useAuth() {
    const { currentUser, setCurrentUser, setToken } = useStore();
    const router = useRouter();

    const register = async (email: string, password: string, username: string) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, isSignUp: true }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setCurrentUser(data.user);
            setToken(data.token);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Check if email is actually a username, or update API to handle email
            // The API expects 'username'. If the user enters email, we might need to handle that.
            // For now, assume the user enters username in the 'email' field or we pass it as username.
            // But the login form usually asks for "Email or Username".
            // Let's assume the current input is the username.

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Sending 'email' as 'username' because the existing API expects 'username'
                body: JSON.stringify({ username: email, password, isSignUp: false }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setCurrentUser(data.user);
            setToken(data.token);
            return true;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setCurrentUser(null);
        setToken(null);
        router.push('/login');
    };

    return {
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: false, // Since we use local state, it's instant
        register,
        login,
        logout,
    };
}

export function useToggleFollow() {
    const toggleFollowMutation = useMutation(api.users.toggleFollow);
    const { currentUser, setUsers, users, setCurrentUser } = useStore();

    return async (targetUserId: Id<"users">) => {
        if (!currentUser) return;

        // Optimistic update in store
        const isFollowing = currentUser.following?.includes(targetUserId);

        // Call backend
        await toggleFollowMutation({
            userId: currentUser._id as Id<"users">,
            targetUserId
        });

        // Update local store to reflect change immediately (or rely on re-fetch if you had one)
        // Since we don't have real-time subscription for the user object in this manual auth flow,
        // we should update the store manually or re-fetch the user.
        // For now, let's rely on the store's toggleFollow action which does optimistic updates
        // BUT wait, the useStore has a toggleFollow action.

        // Actually, better to just call the API and then maybe update the store?
        // The store's 'toggleFollow' updates the state.

        // Let's retrieve the store action
        const storeToggleFollow = useStore.getState().toggleFollow;
        storeToggleFollow(targetUserId);
    };
}
