import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface CrisisAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export function CrisisAlert({ open, onOpenChange, message }: CrisisAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <AlertDialogTitle className="text-center font-headline text-2xl">Immediate Support is Available</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            It sounds like you are going through a difficult time. Please know you are not alone and help is available.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 rounded-lg border bg-muted p-4 text-sm">
            <p className="whitespace-pre-wrap">{message}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full">I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
