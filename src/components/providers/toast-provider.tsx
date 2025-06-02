"use client"

import { ReactNode } from "react"
import { Toaster as ToastContainer } from "@/components/ui/toast"
import { useToast as useToastHook } from "@/components/ui/use-toast"

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts } = useToastHook()
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} />
    </>
  )
}
