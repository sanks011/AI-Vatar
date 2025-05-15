"use client"

import { User, Bell, Settings, Menu, HelpCircle, Plus } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  userName: string
  onToggleSidebar: () => void
  onShowShortcuts: () => void
}

export default function Header({ userName, onToggleSidebar, onShowShortcuts }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-3 sm:p-4 md:p-6 transition-all duration-300 sticky top-0 z-10 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleSidebar} 
            className="flex hover:bg-gray-100 dark:hover:bg-gray-800" 
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AIVatar Dashboard
              </h1>
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold hidden md:block">Beta</div>
            </div>
            <div className="flex flex-wrap items-center text-xs sm:text-sm">
              <p className="text-gray-600 dark:text-gray-300">Welcome back,</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold ml-1">{userName}!</p>
              <p className="text-gray-600 dark:text-gray-300 ml-1 hidden sm:block">Manage and customize your AI avatars</p>
            </div>
          </div>
        </div>

        <div className="mt-3 md:mt-0 flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
          {/* Create button dropdown - visible on md screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Avatar</span>
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Import Avatar</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>From Template</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Create button - only visible on mobile */}
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden rounded-full" 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))}
            aria-label="Create new avatar"
          >
            <Plus className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <Button variant="outline" size="icon" className="rounded-full relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              3
            </Badge>
          </Button>

          <Button variant="outline" size="icon" className="rounded-full hidden sm:flex" onClick={onShowShortcuts} aria-label="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full flex items-center gap-2 pl-3 pr-4">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 hidden sm:inline-block">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onShowShortcuts}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Keyboard Shortcuts</span>
                <DropdownMenuShortcut>?</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
