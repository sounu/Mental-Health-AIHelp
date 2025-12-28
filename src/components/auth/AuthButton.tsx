"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthButton() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium hover:underline"
      >
        Login
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
      className="text-sm text-red-500 hover:underline"
    >
      Logout
    </button>
  );
}
