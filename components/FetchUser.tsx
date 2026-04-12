"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useAppStore from "@/stores/useApp";

export default function FetchUser() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    if (loading) return;

    const isPublicPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup");

    if (!user && !isPublicPage) {
      router.replace("/login");
    }
    if (user && isPublicPage) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  return null;
}