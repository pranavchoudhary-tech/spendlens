import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-teal-400 text-navy-950 hover:bg-teal-300 active:scale-95 shadow-lg shadow-teal-400/25",
        secondary:
          "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95",
        ghost:
          "text-slate-400 hover:text-white hover:bg-white/10 active:scale-95",
        outline:
          "border border-teal-400/50 text-teal-400 hover:bg-teal-400/10 active:scale-95",
        danger:
          "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
