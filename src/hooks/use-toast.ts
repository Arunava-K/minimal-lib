import { useState, useCallback } from "react"
import type { ReactElement } from "react"

import { useIsomorphicLayoutEffect } from "@/lib/hooks/use-isomorphic-layout-effect"
import { genId } from "@/lib/utils"

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ReactElement
  duration?: number
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
}

const useToast = (): {
  toasts: Toast[]
} & ActionType => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = genId()

      setToasts((prev) => {
        if (prev.length >= TOAST_LIMIT) {
          return [...prev.slice(0, TOAST_LIMIT - 1), { id, ...toast }]
        }
        return [...prev, { id, ...toast }]
      })
    },
    [setToasts]
  )

  const updateToast = useCallback(
    (toast: Toast) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === toast.id ? { ...t, ...toast } : t))
      )
    },
    [setToasts]
  )

  const dismissToast = useCallback(
    (toastId: Toast["id"]) => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        )
      )
    },
    [setToasts]
  )

  const removeToast = useCallback(
    (toastId: Toast["id"]) => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId))
    },
    [setToasts]
  )

  useIsomorphicLayoutEffect(() => {
    const handleDismiss = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissToast(toasts[toasts.length - 1]?.id)
      }
    }

    window.addEventListener("keydown", handleDismiss)
    return () => {
      window.removeEventListener("keydown", handleDismiss)
    }
  }, [dismissToast, toasts])

  return {
    toasts,
    addToast,
    updateToast,
    dismissToast,
    removeToast,
  }
}

type ToastProps = {
  /**
   * Fires an toast
   */
  (props: Omit<Toast, "id">): void
}

let count = 0

const toast: ToastProps = (props) => {
  count = count + 1
  const { addToast, dismissToast } = useToast()

  addToast(props)

  if (props.duration !== 0)
    setTimeout(() => {
      dismissToast(props.id)
    }, props.duration || TOAST_REMOVE_DELAY)
}

export { useToast, toast }
