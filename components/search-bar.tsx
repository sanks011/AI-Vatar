"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
    inputRef.current?.focus()
  }

  // Focus the search input when pressing Cmd+F or Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search avatars by name, email, or tag..."
        value={query}
        onChange={handleChange}
        className="pl-10 pr-16 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus-visible:ring-purple-500"
        data-search-input
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:opacity-100">
          <span className="text-xs">⌘</span>F
        </kbd>
      </div>
    </div>
  )
}
