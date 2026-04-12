"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/useApp";
import axios from "axios";

export default function Navbar() {
    const router = useRouter();
    const { user, setUser } = useAppStore();

    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
        } catch {
         }
        setUser(null);
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <div
                    className="text-xl font-semibold tracking-tight cursor-pointer flex items-center gap-2"
                    onClick={() => router.push("/")}
                >
                    <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold">
                        D
                    </div>
                    <span className="text-gray-900">DoNote</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-3">
                    {!user ? (
                        <>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-black transition cursor-pointer"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => router.push("/signup")}
                                className="rounded-xl bg-black px-5 py-2 text-sm text-white shadow-sm hover:bg-gray-900 transition-all duration-200 hover:shadow-md cursor-pointer"
                            >
                                Get Started
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="rounded-xl bg-black px-5 py-2 text-sm text-white shadow-sm hover:bg-gray-900 transition-all duration-200 hover:shadow-md cursor-pointer"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5"
                    onClick={() => setOpen(!open)}
                >
                    <span className="h-0.5 w-6 bg-black rounded"></span>
                    <span className="h-0.5 w-6 bg-black rounded"></span>
                    <span className="h-0.5 w-6 bg-black rounded"></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-40 border-t" : "max-h-0"
                    }`}
            >
                <div className="px-6 py-4 flex flex-col gap-3 bg-white/90 backdrop-blur-md">
                    {!user ? (
                        <>
                            <button
                                onClick={() => {
                                    router.push("/login");
                                    setOpen(false);
                                }}
                                className="text-left text-gray-700 hover:text-black transition"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => {
                                    router.push("/signup");
                                    setOpen(false);
                                }}
                                className="rounded-xl bg-black px-4 py-2 text-white shadow-sm"
                            >
                                Get Started
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            className="rounded-xl bg-black px-4 py-2 text-white shadow-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}