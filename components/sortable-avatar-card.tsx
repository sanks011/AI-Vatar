"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import AvatarCard from "./avatar-card"
import { GripVertical } from "lucide-react"
import type { User } from "@/types"

interface SortableAvatarCardProps {
  avatar: User
  viewMode: "grid" | "list"
  onDelete: () => void
}

export default function SortableAvatarCard({ avatar, viewMode, onDelete }: SortableAvatarCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: avatar.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 bg-white dark:bg-gray-700 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>
      <AvatarCard avatar={avatar} viewMode={viewMode} onDelete={onDelete} />
    </div>
  )
}
