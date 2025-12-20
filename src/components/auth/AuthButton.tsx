"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth on mount (client-only)
    const userId = localStorage.getItem("auth-user-id");
    setIsAuthenticated(Boolean(userId));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // ignore network errors
    }

    // Clear client auth
    localStorage.removeItem("auth-user-id");
    localStorage.removeItem("chat-session-id");

    // Redirect to login
    window.location.href = "/login";
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-primary hover:underline"
      >
        Login
      </Link>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-500 hover:underline"
    >
      Logout
    </button>
  );
}
