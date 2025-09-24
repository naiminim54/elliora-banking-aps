import * as React from "react"
import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  if (variant === "destructive") {
    sonnerToast.error(title || "Error", {
      description,
    })
  } else {
    sonnerToast.success(title || "Success", {
      description,
    })
  }
}

export const useToast = () => {
  return { toast }
}