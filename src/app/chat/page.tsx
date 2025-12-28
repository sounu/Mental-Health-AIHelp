"use client";

import { useEffect, useState } from "react";
import type { ConversationMessage } from "@/lib/types";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load history ONCE
  useEffect(() => {
    fetch("/api/chat")
      .then(res => res.json())
      .then(data => {
        setMessages(
          data.messages?.length
            ? data.messages
            : [
                {
                  role: "ai",
                  content:
                    "Hello! I'm Empatheia. How are you feeling today?",
                },
              ]
        );
        setSessionId(data.sessionId);
      });
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });

      const data = await res.json();
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
