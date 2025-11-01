import { forwardRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from './ChatTypes';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <ScrollArea ref={ref} className="flex-1 min-h-0 overflow-hidden px-4">
        <div className="space-y-4 py-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  message.isBot
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }
);