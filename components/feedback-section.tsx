'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, X, PlusCircle } from 'lucide-react';

interface FeedbackSectionProps {
  type: 'positive' | 'negative';
  title: string;
  icon: React.ReactNode;
  placeholder: string;
  items: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}

export function FeedbackSection({ type, title, icon, placeholder, items, onAdd, onRemove }: FeedbackSectionProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  const IconForItem = () => {
    return type === 'positive' ? (
      <ThumbsUp className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
    ) : (
      <ThumbsDown className="h-4 w-4 text-destructive opacity-50 group-hover:opacity-100 transition-opacity" />
    );
  };

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="handwritten text-lg sm:text-2xl"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
            <div className="flex items-center gap-3">
              <IconForItem />
              <span className="handwritten text-lg sm:text-xl">{item}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 