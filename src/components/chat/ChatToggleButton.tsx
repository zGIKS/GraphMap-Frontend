import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
  onToggle: () => void;
}

export const ChatToggleButton = ({ onToggle }: ChatToggleButtonProps) => {
  return (
    <Button
      onClick={onToggle}
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};