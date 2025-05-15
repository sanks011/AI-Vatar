"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingTourProps {
  onComplete: () => void
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Welcome to AI Avatar Dashboard",
          description: "This quick tour will help you get started with the dashboard and its features.",
          position: "center",
        }
      case 2:
        return {
          title: "Create Your First Avatar",
          description: "Click the + button in the bottom right to create your first AI avatar.",
          position: "bottom-right",
        }
      case 3:
        return {
          title: "Manage Your Avatars",
          description: "View, edit, and organize your avatars in the main dashboard.",
          position: "center",
        }
      case 4:
        return {
          title: "Keyboard Shortcuts",
          description: "Press '?' anytime to see available keyboard shortcuts for faster navigation.",
          position: "top-right",
        }
      default:
        return {
          title: "",
          description: "",
          position: "center",
        }
    }
  }

  const content = getStepContent()

  const getPositionClasses = () => {
    switch (content.position) {
      case "top-right":
        return "top-24 right-8"
      case "bottom-right":
        return "bottom-24 right-8"
      case "center":
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className={`absolute ${getPositionClasses()} bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{content.title}</h3>
          <Button variant="ghost" size="icon" onClick={handleSkip} aria-label="Skip tour">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{content.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i + 1 === step ? "bg-purple-600 dark:bg-purple-400" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSkip} size="sm">
              Skip
            </Button>

            <div className="flex rounded-md overflow-hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={step === 1}
                className="rounded-r-none border-r-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={step === totalSteps ? "default" : "outline"}
                size="sm"
                onClick={handleNext}
                className="rounded-l-none"
              >
                {step === totalSteps ? "Finish" : "Next"}
                {step !== totalSteps && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
