import { Card } from "@/components/ui/card";
import { Clock, Image as ImageIcon } from "lucide-react";

interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  isDemo?: boolean;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelectImage: (item: HistoryItem) => void;
}

export function HistoryList({ history, onSelectImage }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6 shadow-ai">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-ai-text-light mb-3" />
          <h3 className="font-semibold text-muted-foreground mb-2">
            No History Yet
          </h3>
          <p className="text-sm text-ai-text-light">
            Your generated images will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-ai animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Generations</h3>
      </div>
      
      <div className="space-y-3">
        {history.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectImage(item)}
            className="w-full p-3 rounded-lg border border-ai-surface hover:border-primary hover:bg-ai-surface transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-12 h-12 rounded-md object-cover"
                />
                {item.isDemo && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent border border-background rounded-full" />
                )}
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.prompt}
                </p>
                <p className="text-xs text-ai-text-light">
                  {item.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              <ImageIcon className="w-4 h-4 text-ai-text-light group-hover:text-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

export type { HistoryItem };