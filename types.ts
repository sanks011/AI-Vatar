export type AvatarCategory = "Realistic" | "Anime" | "Cartoon" | "Abstract" | "Pixel Art" | "3D"

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
  category?: AvatarCategory
  lastEdited?: string
  usageCount?: number
  performance?: number
  tags?: string[]
  isPublic?: boolean
}

export interface KeyboardShortcut {
  key: string
  description: string
  scope: "global" | "dashboard" | "modal"
}
