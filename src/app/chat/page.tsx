'use client';

import { useState } from 'react';
import { aiConversationAndSentimentAnalysis } from '@/ai/flows/ai-conversation-sentiment-analysis';
import { crisisDetectionAndReferral } from '@/ai/flows/crisis-detection-referral';
import type { ConversationMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { CrisisAlert } from '@/components/chat/crisis-alert';

export default function ChatPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: 'ai', content: "Hello! I'm Empatheia, your personal AI companion for mental wellness. How are you feeling today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [crisisMessage, setCrisisMessage] = useState('');

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: ConversationMessage = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const crisisCheck = await crisisDetectionAndReferral({ message: messageContent });
      if (crisisCheck.isCrisis) {
        setIsCrisis(true);
        setCrisisMessage(crisisCheck.referralMessage);
        setIsLoading(false);
        const aiMessage: ConversationMessage = { role: 'ai', content: "I'm here to help. Please know that support is available." };
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }

      const conversationHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await aiConversationAndSentimentAnalysis({
        message: messageContent,
        conversationHistory,
      });

      const aiMessage: ConversationMessage = { role: 'ai', content: aiResponse.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI call failed:', error);
      const errorMessage: ConversationMessage = {
        role: 'ai',
        content: 'I seem to be having some trouble connecting right now. Please try again in a moment.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px-2rem)] flex-col">
        <CrisisAlert
            open={isCrisis}
            onOpenChange={setIsCrisis}
            message={crisisMessage}
        />
        <div className="flex-1 overflow-y-auto p-4 pr-1">
            <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <div className="p-4 pt-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
    </div>
  );
}
