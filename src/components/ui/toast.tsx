"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border-gray-200",
        destructive: "bg-red-500 text-white border-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  action?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
)
Toast.displayName = "Toast"

export type ToastActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  )
)
ToastAction.displayName = "ToastAction"

// 👇 هنا النوع اللي ناقص
export type ToastActionElement = React.ReactElement<typeof ToastAction>

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "rounded-md p-1 text-gray-500 hover:text-gray-900 focus:outline-none",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

export { Toast, ToastAction, ToastClose, toastVariants }
