"use client"

import { X, Upload, Camera, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import type { User, AvatarCategory } from "@/types"

interface CreateAvatarModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAvatar: (avatar: Partial<User>) => void
}

export default function CreateAvatarModal({ isOpen, onClose, onCreateAvatar }: CreateAvatarModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatarStyle, setAvatarStyle] = useState<AvatarCategory>("Realistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAvatar, setGeneratedAvatar] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isPublic, setIsPublic] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(["AI"])

  // Personality traits sliders
  const [creativity, setCreativity] = useState([50])
  const [helpfulness, setHelpfulness] = useState([70])
  const [humor, setHumor] = useState([30])
  const [knowledge, setKnowledge] = useState([60])

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

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          if (newProgress >= 100) {
            clearInterval(interval)
            // Use a random avatar from reqres
            const avatarId = Math.floor(Math.random() * 10) + 1
            setGeneratedAvatar(`https://reqres.in/img/faces/${avatarId}-image.jpg`)
            setIsGenerating(false)
            return 100
          }
          return newProgress
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const resetForm = () => {
    setStep(1)
    setFirstName("")
    setLastName("")
    setAvatarStyle("Realistic")
    setCreativity([50])
    setHelpfulness([70])
    setHumor([30])
    setKnowledge([60])
    setGeneratedAvatar("")
    setGenerationProgress(0)
    setIsPublic(false)
    setSelectedTags(["AI"])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = () => {
    onCreateAvatar({
      first_name: firstName,
      last_name: lastName,
      avatar: generatedAvatar,
      category: avatarStyle,
      tags: selectedTags,
      isPublic,
    })
    resetForm()
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Basic Information"
      case 2:
        return "Personality Settings"
      case 3:
        return "Generate Avatar"
      case 4:
        return "Final Settings"
      default:
        return "Create New Avatar"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            {step > 1 && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2 -ml-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {getStepTitle()}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-2">Avatar Style</Label>
                <RadioGroup
                  value={avatarStyle}
                  onValueChange={(value) => setAvatarStyle(value as AvatarCategory)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="Realistic" id="realistic" />
                    <Label htmlFor="realistic" className="cursor-pointer">
                      Realistic
                    </Label>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="Anime" id="anime" />
                    <Label htmlFor="anime" className="cursor-pointer">
                      Anime
                    </Label>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="Cartoon" id="cartoon" />
                    <Label htmlFor="cartoon" className="cursor-pointer">
                      Cartoon
                    </Label>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="Abstract" id="abstract" />
                    <Label htmlFor="abstract" className="cursor-pointer">
                      Abstract
                    </Label>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="Pixel Art" id="pixel" />
                    <Label htmlFor="pixel" className="cursor-pointer">
                      Pixel Art
                    </Label>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <RadioGroupItem value="3D" id="3d" />
                    <Label htmlFor="3d" className="cursor-pointer">
                      3D
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Creativity</Label>
                  <span className="text-sm text-gray-500">{creativity[0]}%</span>
                </div>
                <Slider value={creativity} onValueChange={setCreativity} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Helpfulness</Label>
                  <span className="text-sm text-gray-500">{helpfulness[0]}%</span>
                </div>
                <Slider value={helpfulness} onValueChange={setHelpfulness} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Humor</Label>
                  <span className="text-sm text-gray-500">{humor[0]}%</span>
                </div>
                <Slider value={humor} onValueChange={setHumor} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Knowledge</Label>
                  <span className="text-sm text-gray-500">{knowledge[0]}%</span>
                </div>
                <Slider value={knowledge} onValueChange={setKnowledge} max={100} step={1} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Tabs defaultValue="generate">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                </TabsList>
                <TabsContent value="generate" className="space-y-4 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Generate an AI avatar based on your settings
                    </p>

                    {isGenerating && (
                      <div className="mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Generating avatar...</span>
                          <span>{Math.round(generationProgress)}%</span>
                        </div>
                        <Progress value={generationProgress} className="h-2" />
                      </div>
                    )}

                    {!generatedAvatar && !isGenerating ? (
                      <Button onClick={handleGenerate} className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Avatar
                      </Button>
                    ) : generatedAvatar ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={generatedAvatar || "/placeholder.svg"}
                          alt="Generated Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 dark:border-purple-900 mb-4"
                        />
                        <Button variant="outline" onClick={handleGenerate} className="mb-2">
                          Regenerate
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4 pt-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Drag and drop your image here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="space-y-4 pt-4">
                  <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Camera className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Take a photo using your camera</p>
                    <Button variant="outline" size="sm">
                      Open Camera
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {["AI", "Work", "Personal", "Creative", "Professional", "Assistant"].map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-switch">Make Public</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to use this avatar</p>
                </div>
                <Switch id="public-switch" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Avatar Summary</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {firstName} {lastName}
                  </p>
                  <p>
                    <span className="font-medium">Style:</span> {avatarStyle}
                  </p>
                  <p>
                    <span className="font-medium">Personality:</span> Creativity {creativity[0]}%, Helpfulness{" "}
                    {helpfulness[0]}%
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {isPublic ? "Public" : "Private"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          {step === 1 ? (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={(step === 1 && (!firstName || !lastName)) || (step === 3 && !generatedAvatar)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!generatedAvatar}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
            >
              <Check className="mr-2 h-4 w-4" />
              Create Avatar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
