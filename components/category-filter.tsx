"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import type { AvatarCategory } from "@/types"

interface CategoryFilterProps {
  selectedCategory: AvatarCategory | "all"
  onCategoryChange: (category: AvatarCategory | "all") => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange(value as AvatarCategory | "all")}
        >
          <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Realistic">Realistic</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Anime">Anime</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Cartoon">Cartoon</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Abstract">Abstract</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Pixel Art">Pixel Art</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="3D">3D</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
