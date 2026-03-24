import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
}

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel = "Submitting...",
  className,
  disabled = false,
}: AppSubmitButtonProps) => {

  const isDisabled = disabled || isPending;

  return (
    <Button 
      type='submit'
      disabled={isDisabled} 
      className={cn(
        // Acadex Branding: Rounded-xl for that modern app feel
        "w-full h-11 rounded-xl font-bold tracking-wide transition-all duration-200 active:scale-[0.98]",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "shadow-[0_4px_0_0_oklch(0.75_0.15_85)] hover:shadow-[0_2px_0_0_oklch(0.75_0.15_85)] hover:translate-y-[2px]", // Pressable 3D effect
        "disabled:opacity-70 disabled:shadow-none disabled:translate-y-0",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>
            <span>{pendingLabel}</span>
          </>
        ) : (
          children
        )}
      </div>
    </Button>
  )
}

export default AppSubmitButton;