import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variants = {
            default: "bg-[#00CC99] text-white hover:bg-[#00FFCC] hover:text-[#003322] shadow-lg shadow-[#00CC99]/20",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
            outline: "border border-[#FFFFFF]/10 bg-transparent hover:bg-white/5 hover:text-white",
            secondary: "bg-[#00DDDD] text-white hover:bg-[#00FFCC] hover:text-[#003322] shadow-lg shadow-[#00DDDD]/20",
            ghost: "hover:bg-white/5 hover:text-white",
            link: "text-[#00FFCC] underline-offset-4 hover:underline",
        }


        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-12 rounded-lg px-8 text-lg",
            icon: "h-10 w-10",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, cn }
