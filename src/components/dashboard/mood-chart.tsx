'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { moodHistory } from '@/lib/data';

const chartData = moodHistory.map(entry => ({
    date: entry.date,
    Happy: entry.mood === 'Happy' ? 1 : 0,
    Calm: entry.mood === 'Calm' ? 1 : 0,
    Sad: entry.mood === 'Sad' ? 1 : 0,
    Anxious: entry.mood === 'Anxious' ? 1 : 0,
    Neutral: entry.mood === 'Neutral' ? 1 : 0,
}));

const chartConfig = {
  Happy: { label: 'Happy', color: 'hsl(var(--chart-1))' },
  Calm: { label: 'Calm', color: 'hsl(var(--chart-2))' },
  Sad: { label: 'Sad', color: 'hsl(var(--chart-3))' },
  Anxious: { label: 'Anxious', color: 'hsl(var(--chart-4))' },
  Neutral: { label: 'Neutral', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export function MoodChart() {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis hide={true} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="Happy" stackId="a" fill="var(--color-Happy)" radius={4} />
          <Bar dataKey="Calm" stackId="a" fill="var(--color-Calm)" radius={4} />
          <Bar dataKey="Sad" stackId="a" fill="var(--color-Sad)" radius={4} />
          <Bar dataKey="Anxious" stackId="a" fill="var(--color-Anxious)" radius={4} />
          <Bar dataKey="Neutral" stackId="a" fill="var(--color-Neutral)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
