'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { personalizedWellnessRecommendations, PersonalizedWellnessRecommendationsOutput } from '@/ai/flows/personalized-wellness-recommendations';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BookText, Wind, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  mood: z.string().min(2, { message: 'Please describe your current mood.' }),
  goals: z.string().min(2, { message: 'Please tell us about your goals.' }),
});

type Recommendation = PersonalizedWellnessRecommendationsOutput['recommendations'][0];

const iconMap: { [key: string]: React.ElementType } = {
  meditation: Wind,
  journaling: BookText,
  'breathing exercise': Sparkles,
};

export default function WellnessPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      goals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await personalizedWellnessRecommendations({
        mood: values.mood,
        goals: values.goals,
        pastInteractions: 'User has shown interest in mindfulness and stress reduction.', // Mocked for now
      });
      setRecommendations(result.recommendations);
    } catch (e) {
      setError('Sorry, we couldn\'t generate recommendations at this time. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
    const Icon = iconMap[recommendation.type.toLowerCase()] || Sparkles;
    return (
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-accent-foreground" />
              <div>
                <CardTitle className="font-headline text-lg">{recommendation.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{recommendation.type}</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="icon">
              <a href={recommendation.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{recommendation.description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold">Personalized Wellness</h1>
        <p className="mt-2 text-muted-foreground">Get AI-powered recommendations tailored just for you.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tell us about yourself</CardTitle>
          <CardDescription>The more we know, the better we can help.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How are you feeling right now?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A bit stressed but hopeful" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you hoping to achieve?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I want to manage my anxiety better and improve my sleep."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <div className="space-y-4">
            <h2 className="text-center text-2xl font-headline font-bold">Your Recommendations</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((rec, index) => (
                    <RecommendationCard key={index} recommendation={rec} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
