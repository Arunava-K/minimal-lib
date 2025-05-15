
import { useState, useCallback } from "react"
import type { ReactElement } from "react"

import { useIsomorphicLayoutEffect } from "@/lib/hooks/use-isomorphic-layout-effect"
import { genId } from "@/lib/utils"

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ReactElement
  duration?: number
  open?: boolean
  /**
   * @default "default"
   */
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000000

type ActionType = {
  addToast: (toast: Omit<Toast, "id">) => void
  updateToast: (toast: Toast) => void
  dismissToast: (toastId: Toast["id"]) => void
  removeToast: (toastId: Toast["id"]) => void
  toast: (props: Omit<Toast, "id">) => void
}

const toasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

// Singleton pattern to maintain toast state across components
const createToastManager = () => {
  const _addToast = (toast: Omit<Toast, "id">) => {
    const id = genId()
    const newToast = { id, ...toast }
    
    if (toasts.length >= TOAST_LIMIT) {
      toasts.splice(0, toasts.length - TOAST_LIMIT + 1)
    }
    
    toasts.push(newToast)
    listeners.forEach(listener => listener([...toasts]))
    return id
  }

  const _updateToast = (toast: Toast) => {
    const index = toasts.findIndex(t => t.id === toast.id)
    if (index !== -1) {
      toasts[index] = { ...toasts[index], ...toast }
      listeners.forEach(listener => listener([...toasts]))
    }
  }

  const _dismissToast = (toastId: Toast["id"]) => {
    const index = toasts.findIndex(t => t.id === toastId)
    if (index !== -1) {
      toasts[index] = { ...toasts[index], open: false }
      listeners.forEach(listener => listener([...toasts]))
    }
  }

  const _removeToast = (toastId: Toast["id"]) => {
    const index = toasts.findIndex(t => t.id === toastId)
    if (index !== -1) {
      toasts.splice(index, 1)
      listeners.forEach(listener => listener([...toasts]))
    }
  }

  const _toast = (props: Omit<Toast, "id">) => {
    const id = _addToast(props)
    
    if (props.duration !== 0) {
      setTimeout(() => {
        _dismissToast(id)
      }, props.duration || TOAST_REMOVE_DELAY)
    }
    
    return id
  }

  return {
    addToast: _addToast,
    updateToast: _updateToast,
    dismissToast: _dismissToast,
    removeToast: _removeToast,
    toast: _toast,
    subscribe: (listener: (toasts: Toast[]) => void) => {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    getToasts: () => [...toasts]
  }
}

const toastManager = createToastManager()

export function useToast(): { toasts: Toast[] } & ActionType {
  const [_toasts, setToasts] = useState<Toast[]>(toastManager.getToasts())
  
  useIsomorphicLayoutEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts)
    return unsubscribe
  }, [])

  useIsomorphicLayoutEffect(() => {
    const handleDismiss = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const lastToast = _toasts[_toasts.length - 1]
        if (lastToast) {
          toastManager.dismissToast(lastToast.id)
        }
      }
    }

    window.addEventListener("keydown", handleDismiss)
    return () => {
      window.removeEventListener("keydown", handleDismiss)
    }
  }, [_toasts])

  return {
    toasts: _toasts,
    addToast: toastManager.addToast,
    updateToast: toastManager.updateToast,
    dismissToast: toastManager.dismissToast,
    removeToast: toastManager.removeToast,
    toast: toastManager.toast
  }
}

export const toast = toastManager.toast
