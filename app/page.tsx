"use client"

import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import Header from "@/components/header"
import AvatarGrid from "@/components/avatar-grid"
import FloatingActionButton from "@/components/floating-action-button"
import CreateAvatarModal from "@/components/create-avatar-modal"
import StatsSection from "@/components/stats-section"
import SearchBar from "@/components/search-bar"
import CategoryFilter from "@/components/category-filter"
import Sidebar from "@/components/sidebar"
import KeyboardShortcutsModal from "@/components/keyboard-shortcuts-modal"
import OnboardingTour from "@/components/onboarding-tour"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

import type { User, AvatarCategory } from "@/types"

export default function Dashboard() {
  const [avatars, setAvatars] = useState<User[]>([])
  const [filteredAvatars, setFilteredAvatars] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory | "all">("all")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if this is the first visit
    if (typeof window !== "undefined") {
      return localStorage.getItem("onboardingComplete") !== "true"
    }
    return false
  })
  const { toast } = useToast()
  const isMobile = useIsMobile() // Get mobile state
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // Keyboard shortcuts
  useHotkeys("n", () => setIsModalOpen(true), { scopes: "dashboard" })
  useHotkeys("f", () => document.querySelector<HTMLInputElement>("[data-search-input]")?.focus(), {
    scopes: "dashboard",
  })
  useHotkeys("escape", () => setIsModalOpen(false), { scopes: "modal", enableOnTags: ["INPUT", "SELECT", "TEXTAREA"] })
  useHotkeys("?", () => setShowShortcutsModal(true), { scopes: "dashboard" })
  useHotkeys("b", () => setIsSidebarOpen(!isSidebarOpen), { scopes: "dashboard" })

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://reqres.in/api/users?page=1&per_page=12", {
          headers: {
            "x-api-key": "reqres-free-v1",
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        // Add some additional properties to make the avatars more interesting
        const categories: AvatarCategory[] = ["Realistic", "Anime", "Cartoon", "Abstract", "Pixel Art", "3D"]
        const enhancedAvatars = data.data.map((avatar: User) => ({
          ...avatar,
          category: categories[Math.floor(Math.random() * categories.length)],
          lastEdited: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          usageCount: Math.floor(Math.random() * 100),
          performance: Math.floor(Math.random() * 100),
          tags: ["AI", "Assistant", Math.random() > 0.5 ? "Work" : "Personal", Math.random() > 0.7 ? "Favorite" : ""],
          isPublic: Math.random() > 0.7,
        }))

        setAvatars(enhancedAvatars)
        setFilteredAvatars(enhancedAvatars)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to fetch avatars:", err)
        setError("Failed to load avatars. Please try again later.")
        setIsLoading(false)

        // Fallback to dummy data if API fails
        const fallbackData = [
          {
            id: 1,
            email: "george.bluth@reqres.in",
            first_name: "George",
            last_name: "Bluth",
            avatar: "https://reqres.in/img/faces/1-image.jpg",
            category: "Realistic",
            lastEdited: new Date(Date.now() - 2000000000).toISOString(),
            usageCount: 42,
            performance: 87,
            tags: ["AI", "Assistant", "Work"],
            isPublic: true,
          },
          {
            id: 2,
            email: "janet.weaver@reqres.in",
            first_name: "Janet",
            last_name: "Weaver",
            avatar: "https://reqres.in/img/faces/2-image.jpg",
            category: "Anime",
            lastEdited: new Date(Date.now() - 5000000000).toISOString(),
            usageCount: 18,
            performance: 92,
            tags: ["AI", "Personal", "Favorite"],
            isPublic: false,
          },
          {
            id: 3,
            email: "emma.wong@reqres.in",
            first_name: "Emma",
            last_name: "Wong",
            avatar: "https://reqres.in/img/faces/3-image.jpg",
            category: "Cartoon",
            lastEdited: new Date(Date.now() - 8000000000).toISOString(),
            usageCount: 65,
            performance: 78,
            tags: ["AI", "Work"],
            isPublic: true,
          },
        ]

        setAvatars(fallbackData)
        setFilteredAvatars(fallbackData)
      }
    }

    fetchAvatars()
  }, [])

  useEffect(() => {
    filterAvatars(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory, avatars])

  const filterAvatars = (query: string, category: AvatarCategory | "all") => {
    let filtered = [...avatars]

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (avatar) =>
          avatar.first_name.toLowerCase().includes(query.toLowerCase()) ||
          avatar.last_name.toLowerCase().includes(query.toLowerCase()) ||
          avatar.email.toLowerCase().includes(query.toLowerCase()) ||
          avatar.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((avatar) => avatar.category === category)
    }

    setFilteredAvatars(filtered)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCreateAvatar = (newAvatar: Partial<User>) => {
    const avatar = {
      id: avatars.length + 1,
      email: `${newAvatar.first_name?.toLowerCase()}.${newAvatar.last_name?.toLowerCase()}@example.com`,
      first_name: newAvatar.first_name || "New",
      last_name: newAvatar.last_name || "Avatar",
      avatar: newAvatar.avatar || "https://reqres.in/img/faces/7-image.jpg",
      category: (newAvatar.category as AvatarCategory) || "Realistic",
      lastEdited: new Date().toISOString(),
      usageCount: 0,
      performance: 100,
      tags: ["AI", "New"],
      isPublic: false,
    }

    setAvatars([avatar, ...avatars])
    setIsModalOpen(false)

    toast({
      title: "Avatar Created",
      description: `${avatar.first_name} ${avatar.last_name} has been created successfully.`,
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: AvatarCategory | "all") => {
    setSelectedCategory(category)
  }

  const handleDeleteAvatar = (id: number) => {
    setAvatars(avatars.filter((avatar) => avatar.id !== id))

    toast({
      title: "Avatar Deleted",
      description: "The avatar has been deleted successfully.",
      variant: "destructive",
    })
  }

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingComplete", "true")
    }
    toast({
      title: "Welcome to AI Avatar Dashboard!",
      description: "You can press '?' anytime to see keyboard shortcuts.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
        <div className="flex h-screen overflow-hidden relative">
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          {/* Overlay for mobile sidebar - only shows on mobile when sidebar is open */}
          {isSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          <div className="flex-1 overflow-auto transition-all duration-300">
            <div className="container mx-auto px-4 py-8">
              <Header
                userName="Alex"
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onShowShortcuts={() => setShowShortcutsModal(true)}
              />

              {error && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md"
                  role="alert"
                >
                  <p>{error}</p>
                </div>
              )}

              <StatsSection avatars={avatars} isLoading={isLoading} />

              <div className="mt-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                </div>
              </div>

              <main className="mt-6 pb-20">
                <AvatarGrid avatars={filteredAvatars} isLoading={isLoading} onDelete={handleDeleteAvatar} />
              </main>

              <FloatingActionButton onClick={handleOpenModal} />

              <CreateAvatarModal isOpen={isModalOpen} onClose={handleCloseModal} onCreateAvatar={handleCreateAvatar} />

              <KeyboardShortcutsModal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />

              {showOnboarding && <OnboardingTour onComplete={handleCompleteOnboarding} />}
            </div>
          </div>
        </div>
        <Toaster />
      </div>
  )
}
