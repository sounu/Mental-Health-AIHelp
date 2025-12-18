import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { meditations } from '@/lib/data';
import { Clock, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeditationsPage() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Guided Meditations</h1>
        <p className="text-muted-foreground">Find a moment of peace and calm.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {meditations.map((meditation) => {
          const image = getImage(meditation.imageId);
          return (
            <Card key={meditation.id} className="flex flex-col">
              <CardHeader className="p-0">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    width={600}
                    height={400}
                    className="aspect-video w-full rounded-t-lg object-cover"
                  />
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-2 p-4">
                <CardTitle className="font-headline text-xl">{meditation.title}</CardTitle>
                <CardDescription>{meditation.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{meditation.duration}</span>
                </div>
                <Button size="icon" variant="ghost">
                  <PlayCircle className="h-6 w-6" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
