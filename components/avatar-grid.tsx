"use client"

import AvatarCard from "./avatar-card"
import { Button } from "@/components/ui/button"
import { Grid3X3, List, ArrowDownAZ, ArrowUpZA, Clock, Star } from "lucide-react"
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import SortableAvatarCard from "./sortable-avatar-card"
import type { User } from "@/types"

type SortOption = "name" | "date" | "usage" | "performance"
type SortDirection = "asc" | "desc"

interface AvatarGridProps {
  avatars: User[]
  isLoading: boolean
  onDelete: (id: number) => void
}

export default function AvatarGrid({ avatars, isLoading, onDelete }: AvatarGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isDraggable, setIsDraggable] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      toggleSortDirection()
    } else {
      setSortBy(option)
      setSortDirection("asc")
    }
  }

  const sortedAvatars = [...avatars].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        break
      case "date":
        comparison = new Date(a.lastEdited || "").getTime() - new Date(b.lastEdited || "").getTime()
        break
      case "usage":
        comparison = (a.usageCount || 0) - (b.usageCount || 0)
        break
      case "performance":
        comparison = (a.performance || 0) - (b.performance || 0)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Avatars</h2>
          <div className="flex gap-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>

        <div
          className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
              <div className={`flex ${viewMode === "grid" ? "flex-col items-center" : "items-center gap-4"}`}>
                <div
                  className={`${viewMode === "grid" ? "w-32 h-32" : "w-16 h-16"} bg-gray-200 dark:bg-gray-700 rounded-full mb-4`}
                ></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  {viewMode === "list" && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>}
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (avatars.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Avatars Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or create a new avatar.</p>
        <Button>Create New Avatar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Avatars <span className="text-gray-500 dark:text-gray-400">({avatars.length})</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${sortBy === "name" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              onClick={() => handleSort("name")}
            >
              {sortBy === "name" ? (
                sortDirection === "asc" ? (
                  <ArrowDownAZ className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowUpZA className="h-4 w-4 mr-1" />
                )
              ) : null}
              Name
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${sortBy === "date" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              onClick={() => handleSort("date")}
            >
              {sortBy === "date" ? (
                sortDirection === "asc" ? (
                  <Clock className="h-4 w-4 mr-1" />
                ) : (
                  <Clock className="h-4 w-4 mr-1" />
                )
              ) : null}
              Date
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${sortBy === "performance" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              onClick={() => handleSort("performance")}
            >
              {sortBy === "performance" ? (
                sortDirection === "asc" ? (
                  <Star className="h-4 w-4 mr-1" />
                ) : (
                  <Star className="h-4 w-4 mr-1" />
                )
              ) : null}
              Rating
            </Button>
          </div>

          <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant={isDraggable ? "default" : "outline"} size="sm" onClick={() => setIsDraggable(!isDraggable)}>
            {isDraggable ? "Done" : "Arrange"}
          </Button>
        </div>
      </div>

      {isDraggable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter}>
          <SortableContext items={sortedAvatars.map((avatar) => avatar.id)} strategy={rectSortingStrategy}>
            <div
              className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
            >
              {sortedAvatars.map((avatar) => (
                <SortableAvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  viewMode={viewMode}
                  onDelete={() => onDelete(avatar.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div
          className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
        >
          {sortedAvatars.map((avatar) => (
            <AvatarCard key={avatar.id} avatar={avatar} viewMode={viewMode} onDelete={() => onDelete(avatar.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
