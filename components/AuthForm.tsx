"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, register, isAuthenticated } = useAuth();
    const router = useRouter();

    if (isAuthenticated) {
        router.push("/");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, username);
            }
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        IN
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {isLogin ? "Welcome back!" : "Create your account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Powered by Convex • Real-time database & authentication
                    </p>
                </div>
            </div>
        </div>
    );
}
