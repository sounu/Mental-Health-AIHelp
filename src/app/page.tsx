import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Check, Bot, Zap, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'dashboard-viz');
  const socialProofImage = PlaceHolderImages.find((img) => img.id === 'social-proof');

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'Empathetic AI Companion',
      description: 'Engage in meaningful conversations with an AI that understands and supports your emotional well-being.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Personalized Wellness',
      description: 'Receive tailored recommendations for meditations, journaling, and exercises based on your unique needs.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Crisis Support',
      description: 'Instant access to resources and support when you need it most, with crisis detection and referral.',
    },
  ];

  return (
    <div className="w-full space-y-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-center">
        <div className="absolute -inset-20 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_-20%,rgba(168,85,247,0.3),rgba(255,255,255,0))]"></div>
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <p className="font-semibold text-primary">Your Journey to Mental Wellness Starts Here</p>
          <h1 className="mb-6 mt-2 text-5xl font-extrabold tracking-tight md:text-7xl">
            Meet Empatheia, Your AI Wellness Companion
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-foreground/80">
            A highly personalized and empathetic AI designed to support your mental wellness through conversation, guidance, and personalized activities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/chat">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link href="/meditations">Explore Features</Link>
            </Button>
          </div>

          <div className="relative mt-16">
            <div className="absolute -inset-4 rounded-xl bg-primary/20 blur-2xl"></div>
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                width={1200}
                height={750}
                className="relative aspect-video w-full rounded-2xl border border-white/10 object-cover shadow-2xl shadow-primary/20"
                priority
              />
            )}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      {socialProofImage && (
        <section className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Trusted by individuals worldwide</p>
          <div className="mt-4 flex justify-center">
            <Image
              src={socialProofImage.imageUrl}
              alt={socialProofImage.description}
              data-ai-hint={socialProofImage.imageHint}
              width={800}
              height={100}
              className="w-full max-w-3xl"
            />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">A New Approach to Mental Wellness</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Empatheia combines cutting-edge AI with proven wellness techniques.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-foreground/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
            <div className="relative rounded-2xl border border-primary/50 bg-gradient-to-br from-background to-primary/5 p-10 backdrop-blur-lg">
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-primary/20 blur-xl"></div>
            <h2 className="text-4xl font-extrabold tracking-tight">Ready to Begin Your Journey?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
                Sign up today and take the first step towards a healthier, happier you. It&apos;s free to start.
            </p>
            <div className="mt-8">
                <Button asChild size="lg" className="font-semibold">
                <Link href="/chat">
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                </Button>
            </div>
            </div>
        </div>
      </section>

    </div>
  );
}
