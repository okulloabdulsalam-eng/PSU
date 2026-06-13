import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-700",
        easy: "bg-green-100 text-green-700",
        medium: "bg-amber-100 text-amber-700",
        hard: "bg-red-100 text-red-700",
        premium: "bg-purple-100 text-purple-700",
        free: "bg-green-100 text-green-700",
        secondary: "bg-background text-muted",
        outline: "border border-border text-dark",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
