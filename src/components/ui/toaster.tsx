'use client';

import { Toaster as ToasterComponent } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();
  return <ToasterComponent toasts={toasts} />;
}
