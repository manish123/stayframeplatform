'use client';

import { cn } from '@/lib/utils';

type Step = {
  id: string;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
};

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-4 w-4 text-primary-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <div
                  className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <div className="group relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted bg-background">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute left-6 top-1/2 -ml-px mt-0.5 h-0.5 w-full bg-muted" />
            )}
            <div className="absolute left-1/2 mt-6 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted-foreground">
              {step.name}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
