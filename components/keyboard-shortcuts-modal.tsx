"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import type { KeyboardShortcut } from "@/types"

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts: KeyboardShortcut[] = [
  { key: "?", description: "Show keyboard shortcuts", scope: "global" },
  { key: "n", description: "Create new avatar", scope: "dashboard" },
  { key: "f", description: "Focus search", scope: "dashboard" },
  { key: "b", description: "Toggle sidebar", scope: "dashboard" },
  { key: "g + d", description: "Go to dashboard", scope: "global" },
  { key: "g + a", description: "Go to avatars", scope: "global" },
  { key: "g + c", description: "Go to conversations", scope: "global" },
  { key: "g + s", description: "Go to settings", scope: "global" },
  { key: "Escape", description: "Close modal", scope: "modal" },
]

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="shortcuts-title" className="text-xl font-semibold text-gray-800 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Global
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((shortcut) => shortcut.scope === "global")
                  .map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Dashboard
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((shortcut) => shortcut.scope === "dashboard")
                  .map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Modals
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((shortcut) => shortcut.scope === "modal")
                  .map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
