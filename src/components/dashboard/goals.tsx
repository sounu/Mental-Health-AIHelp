import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { goals } from '@/lib/data';
import { CheckCircle2, Circle } from 'lucide-react';

export function Goals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Goals</CardTitle>
        <CardDescription>Stay on track with your wellness objectives.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center gap-3">
              {goal.completed ? <CheckCircle2 className="h-5 w-5 text-accent-foreground" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
              <Label
                htmlFor={`goal-${goal.id}`}
                className={`flex-1 text-sm ${goal.completed ? 'text-muted-foreground line-through' : ''}`}
              >
                {goal.text}
              </Label>
              <Checkbox id={`goal-${goal.id}`} checked={goal.completed} className="hidden" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
