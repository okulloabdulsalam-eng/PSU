import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold font-sans ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-border bg-surface hover:bg-background text-dark",
        secondary: "bg-background text-dark hover:bg-border",
        ghost: "hover:bg-background hover:text-dark",
        link: "text-primary-500 underline-offset-4 hover:underline p-0 min-h-0",
        premium: "bg-gradient-to-r from-accent-purple to-primary-500 text-white hover:opacity-90",
        success: "bg-accent-green text-white hover:opacity-90",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs rounded-lg min-h-[36px]",
        lg: "px-8 py-4 text-base rounded-xl",
        icon: "h-11 w-11 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
