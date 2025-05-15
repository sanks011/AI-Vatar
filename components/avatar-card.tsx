"use client"

import type React from "react"

import { Edit, Trash2, MoreVertical, MessageSquare, Copy, Share2, Star, Download, Lock, Globe } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { User } from "@/types"

interface AvatarCardProps {
  avatar: User
  viewMode: "grid" | "list"
  onDelete: () => void
}

export default function AvatarCard({ avatar, viewMode, onDelete }: AvatarCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isStarred, setIsStarred] = useState(avatar.tags?.includes("Favorite") || false)

  const lastEdited = avatar.lastEdited
    ? formatDistanceToNow(new Date(avatar.lastEdited), { addSuffix: true })
    : "recently"

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Realistic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Anime":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "Cartoon":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Abstract":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Pixel Art":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "3D":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStarred(!isStarred)
  }

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
          viewMode === "grid" ? "transform hover:-translate-y-1" : ""
        } group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`p-6 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
          <div className={`${viewMode === "list" ? "" : "flex flex-col items-center"}`}>
            <div className="relative mb-4">
              <img
                src={avatar.avatar || "/placeholder.svg"}
                alt={`${avatar.first_name} ${avatar.last_name}`}
                className={`${
                  viewMode === "grid" ? "w-32 h-32" : "w-16 h-16"
                } rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 transition-transform group-hover:scale-105`}
              />
              {isHovered && viewMode === "grid" && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300">
                  <Edit className="h-8 w-8 text-white" />
                </div>
              )}

              <div className="absolute -top-2 -right-2 z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full ${
                          isStarred ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" : "text-gray-400"
                        } hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30`}
                        onClick={handleToggleStar}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isStarred ? "Remove from favorites" : "Add to favorites"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {avatar.category && (
                <Badge
                  className={`absolute -bottom-2 ${viewMode === "grid" ? "right-0" : "-right-4"} ${getCategoryColor(avatar.category)}`}
                >
                  {avatar.category}
                </Badge>
              )}

              {avatar.isPublic !== undefined && (
                <Badge
                  className={`absolute -bottom-2 ${viewMode === "grid" ? "left-0" : "-left-4"} ${
                    avatar.isPublic
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {avatar.isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                  {avatar.isPublic ? "Public" : "Private"}
                </Badge>
              )}
            </div>

            <div className={viewMode === "list" ? "flex-1" : ""}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {avatar.first_name} {avatar.last_name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{avatar.email}</p>

              <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Edited {lastEdited}</span>
                {avatar.usageCount !== undefined && (
                  <>
                    <span>•</span>
                    <span>Used {avatar.usageCount} times</span>
                  </>
                )}
              </div>

              {avatar.tags && avatar.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {avatar.tags
                    .filter((tag) => tag && tag !== "Favorite") // Filter out empty tags and Favorite which we handle separately
                    .map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              )}

              {avatar.performance !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Performance</span>
                    <span className="text-xs font-medium">{avatar.performance}%</span>
                  </div>
                  <Progress value={avatar.performance} className="h-1.5" />
                </div>
              )}

              <div className={`flex ${viewMode === "grid" ? "justify-center" : "justify-start"} gap-2`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>

                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      <span>Export</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                      <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the avatar "{avatar.first_name} {avatar.last_name}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
