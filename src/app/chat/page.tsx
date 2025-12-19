'use client';

import { useState } from 'react';
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'API error');
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
