'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Leaf, Frown, Gauge, Meh } from 'lucide-react';
import { useRouter } from 'next/navigation';

const moods = [
  { name: 'Happy', icon: Smile, color: 'text-green-500' },
  { name: 'Calm', icon: Leaf, color: 'text-blue-500' },
  { name: 'Sad', icon: Frown, color: 'text-gray-500' },
  { name: 'Anxious', icon: Gauge, color: 'text-yellow-500' },
  { name: 'Neutral', icon: Meh, color: 'text-purple-500' },
];

export function DailyCheckin() {
  const router = useRouter();

  const handleJournalClick = () => {
    router.push('/journal');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Select your current mood:</h3>
        <div className="flex flex-wrap gap-4">
          {moods.map((mood) => (
            <Button key={mood.name} variant="outline" className="flex h-24 w-24 flex-col gap-2 border-2">
              <mood.icon className={`h-8 w-8 ${mood.color}`} />
              <span>{mood.name}</span>
            </Button>
          ))}
        </div>
      </div>
      <Card className="bg-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Ready to reflect?</CardTitle>
          <CardDescription>Writing down your thoughts can be a great way to process them.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleJournalClick} size="lg">Write in Journal</Button>
        </CardContent>
      </Card>
    </div>
  );
}
