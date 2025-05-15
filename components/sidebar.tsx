"use client"

import type React from "react"

import { useState } from "react"
import {
  Home,
  Users,
  Settings,
  HelpCircle,
  BarChart2,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Layers,
  Palette,
  Zap,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  badge?: number | string
  onClick?: () => void
}

function SidebarItem({ icon, label, isActive = false, badge, onClick }: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors",
        isActive && "bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className={cn(
          "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
          typeof badge === "string" && badge.toLowerCase() === "new" 
            ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" 
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        )}>
          {badge}
        </span>
      )}
    </Button>
  )
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <div
      className={cn(
        "fixed md:relative h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden flex flex-col shadow-sm z-20",
        isOpen 
          ? "w-64 translate-x-0" 
          : "w-0 -translate-x-full md:-translate-x-16",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">AIVatar</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="flex hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-1">
          <SidebarItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            isActive={activeItem === "dashboard"}
            onClick={() => setActiveItem("dashboard")}
            badge="New"
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="My Avatars"
            badge={12}
            isActive={activeItem === "avatars"}
            onClick={() => setActiveItem("avatars")}
          />
          <SidebarItem
            icon={<MessageSquare className="h-5 w-5" />}
            label="Conversations"
            badge={3}
            isActive={activeItem === "conversations"}
            onClick={() => setActiveItem("conversations")}
          />
          <SidebarItem
            icon={<Sparkles className="h-5 w-5" />}
            label="Generate"
            isActive={activeItem === "generate"}
            onClick={() => setActiveItem("generate")}
          />
          <SidebarItem
            icon={<BarChart2 className="h-5 w-5" />}
            label="Analytics"
            isActive={activeItem === "analytics"}
            onClick={() => setActiveItem("analytics")}
          />
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3
            className={cn(
              "px-3 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
              !isOpen && "md:hidden",
            )}
          >
            Resources
          </h3>
          <nav className="space-y-1">
            <SidebarItem
              icon={<Layers className="h-5 w-5" />}
              label="Templates"
              isActive={activeItem === "templates"}
              onClick={() => setActiveItem("templates")}
            />
            <SidebarItem
              icon={<Palette className="h-5 w-5" />}
              label="Style Gallery"
              isActive={activeItem === "gallery"}
              onClick={() => setActiveItem("gallery")}
            />
            <SidebarItem
              icon={<Zap className="h-5 w-5" />}
              label="Quick Start"
              isActive={activeItem === "quickstart"}
              onClick={() => setActiveItem("quickstart")}
            />
            <SidebarItem
              icon={<BookOpen className="h-5 w-5" />}
              label="Documentation"
              isActive={activeItem === "docs"}
              onClick={() => setActiveItem("docs")}
            />
          </nav>
        </div>
      </div>}

      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="space-y-1">
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              isActive={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
            <SidebarItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              isActive={activeItem === "help"}
              onClick={() => setActiveItem("help")}
            />
          </div>
        </div>
      )}
      
      {/* Hidden but maintained for animation purposes */}
      {!isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto opacity-0">
          <div className="w-0 overflow-hidden">
            {/* Spacer */}
          </div>
        </div>
      )}
    </div>
  )
}
