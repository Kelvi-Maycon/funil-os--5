import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-[14px] font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-[#A66133] shadow-sm',
        dark: 'bg-[#42332A] text-white hover:bg-[#32261F] shadow-sm',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-primary bg-transparent text-primary hover:bg-primary/5 shadow-sm',
        secondary: 'bg-secondary text-primary hover:bg-secondary/80 shadow-sm',
        ghost: 'hover:bg-secondary hover:text-primary shadow-none',
        link: 'text-primary underline-offset-4 hover:underline shadow-none',
      },
      size: {
        default: 'h-[40px] px-[15px]',
        sm: 'h-[36px] px-[12px] text-[13px]',
        lg: 'h-[48px] px-[24px] text-[15px]',
        icon: 'h-[40px] w-[40px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
