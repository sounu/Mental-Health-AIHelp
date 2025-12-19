'use client';

import { useState, useEffect } from 'react';
import type { ConversationMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';

export default function ChatPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: 'ai',
      content:
        "Hello! I'm Empatheia, your personal AI companion for mental wellness. How are you feeling today?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('chat-session-id');
  });

  // 🔁 Load chat history on page load
  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        const data = await res.json();

        if (res.ok && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [sessionId]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      role: 'user',
      content: messageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-1',
          message: messageContent,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'API error');
      }

      // 🚨 Crisis flag (for UI later)
      if (data.isCrisis) {
        console.warn('CRISIS DETECTED');
      }

      // 💾 Persist sessionId
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chat-session-id', data.sessionId);
      }

      const aiMessage: ConversationMessage = {
        role: 'ai',
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat API failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'I’m having trouble responding right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px-2rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4 pr-1">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4 pt-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
