import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { journalEntries } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function JournalPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">New Journal Entry</CardTitle>
            <CardDescription>What's on your mind today? Let it all out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start writing here..."
              className="min-h-[200px]"
            />
            <Button>Save Entry</Button>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">Past Entries</h2>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          {journalEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
                    </div>
                    <Badge variant="secondary">{entry.mood}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
