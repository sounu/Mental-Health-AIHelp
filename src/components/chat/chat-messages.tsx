import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ConversationMessage } from '@/lib/types';
import { Bot, User } from 'lucide-react';

export function ChatMessages({ messages, isLoading }: { messages: ConversationMessage[]; isLoading: boolean }) {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            'flex items-start gap-3',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'ai' && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary">
                <Bot />
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              'max-w-sm rounded-lg px-4 py-2 md:max-w-md lg:max-w-lg',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          </div>
          {message.role === 'user' && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start justify-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot />
                </AvatarFallback>
            </Avatar>
            <div className="max-w-sm rounded-lg bg-muted px-4 py-2 md:max-w-md lg:max-w-lg">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{animationDelay: '0s'}} />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{animationDelay: '0.2s'}} />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{animationDelay: '0.4s'}} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
