"use client";

import { useEffect, useState } from "react";
import type { ConversationMessage } from "@/lib/types";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: "ai",
      content:
        "Hello! I'm Empatheia, your personal AI companion for mental wellness. How are you feeling today?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  /* -------------------------------------------------- */
  /* 🔐 LOAD AUTH USER ON MOUNT */
  /* -------------------------------------------------- */
  useEffect(() => {
    const uid = localStorage.getItem("auth-user-id");
    setUserId(uid);
  }, []);

  /* -------------------------------------------------- */
  /* 🔁 LOAD CHAT HISTORY ONCE (AFTER LOGIN) */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!userId) return;

    const storedSessionId = localStorage.getItem("chat-session-id");
    if (!storedSessionId) return;

    setSessionId(storedSessionId);

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `/api/chat?sessionId=${storedSessionId}`
        );
        const data = await res.json();

        if (res.ok && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    loadHistory();
  }, [userId]);

  /* -------------------------------------------------- */
  /* 🚪 LOGOUT */
  /* -------------------------------------------------- */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    localStorage.removeItem("auth-user-id");
    localStorage.removeItem("chat-session-id");

    window.location.href = "/login";
  };

  /* -------------------------------------------------- */
  /* 💬 SEND MESSAGE */
  /* -------------------------------------------------- */
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    if (!userId) {
      alert("Please login first");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message,
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chat-session-id", data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I’m having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* 🧱 UI */
  /* -------------------------------------------------- */
  return (
    <div className="flex h-[calc(100vh-56px-2rem)] flex-col">

      {/* LOGOUT BUTTON */}
      <div className="p-2 text-right">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pr-1">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 pt-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
