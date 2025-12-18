'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Bot, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <SidebarProvider>
      {!isLandingPage && (
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className='flex items-center gap-2'>
              <Bot className="size-8 text-primary" />
              <h1 className="text-2xl font-headline font-bold">Empatheia</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
      )}
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            {!isLandingPage && <SidebarTrigger className="md:hidden" />}
             {isLandingPage && (
                <Link href="/" className='flex items-center gap-2'>
                    <Bot className="size-8 text-primary" />
                    <h1 className="text-xl font-bold">Empatheia</h1>
                </Link>
             )}
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4">
                <Button variant="ghost" asChild><Link href="/#features">Features</Link></Button>
                <Button variant="ghost" asChild><Link href="/meditations">Resources</Link></Button>
            </nav>
            <Button asChild>
                <Link href="/chat">
                    <LogIn className="mr-2 h-4 w-4" /> Get Started
                </Link>
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
