"use client"

import type React from "react"

import { useState } from "react"
import { Users, MessageSquare, Sparkles, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from "recharts"
import type { User } from "@/types"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
  change?: string
  trend?: "up" | "down" | "neutral"
  isLoading?: boolean
}

function StatCard({ title, value, icon, description, change, trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>

          {change && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium flex items-center ${
                  trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : trend === "down"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {trend === "up" && <ChevronUp className="h-3 w-3 mr-1" />}
                {trend === "down" && <ChevronDown className="h-3 w-3 mr-1" />}
                {change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">{icon}</div>
      </div>
    </div>
  )
}

interface StatsSectionProps {
  avatars: User[]
  isLoading: boolean
}

export default function StatsSection({ avatars, isLoading }: StatsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate total usage
  const totalUsage = avatars.reduce((sum, avatar) => sum + (avatar.usageCount || 0), 0)

  // Calculate average performance
  const avgPerformance = avatars.length
    ? Math.round(avatars.reduce((sum, avatar) => sum + (avatar.performance || 0), 0) / avatars.length)
    : 0
    
  // Dummy data for usage trends chart
  const usageTrendsData = [
    { name: 'Jan', conversations: 65, generation: 28, engagement: 80 },
    { name: 'Feb', conversations: 59, generation: 40, engagement: 70 },
    { name: 'Mar', conversations: 80, generation: 45, engagement: 78 },
    { name: 'Apr', conversations: 81, generation: 38, engagement: 90 },
    { name: 'May', conversations: 90, generation: 52, engagement: 85 },
    { name: 'Jun', conversations: 125, generation: 70, engagement: 92 },
    { name: 'Jul', conversations: 110, generation: 55, engagement: 89 },
  ]

  return (
    <div className="mt-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Avatars"
          value={isLoading ? "—" : avatars.length}
          icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          description="Active AI avatars in your account"
          change="+3"
          trend="up"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Usage"
          value={isLoading ? "—" : totalUsage}
          icon={<MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          description="Conversations with your avatars"
          change="+24%"
          trend="up"
          isLoading={isLoading}
        />
        <StatCard
          title="Generation Credits"
          value="250"
          icon={<Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
          description="Available credits for new avatars"
          change="-15"
          trend="down"
          isLoading={isLoading}
        />
        <StatCard
          title="Avg. Performance"
          value={`${avgPerformance}%`}
          icon={<TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />}
          description="Average avatar performance score"
          change="+5%"
          trend="up"
          isLoading={isLoading}
        />
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Usage Trends</h3>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Conversations</span>
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Generation</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-2"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Engagement</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usageTrendsData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                      border: 'none', 
                      borderRadius: '0.5rem',
                      color: '#f3f4f6',
                    }} 
                    labelStyle={{ color: '#f3f4f6' }}
                    itemStyle={{ color: '#f3f4f6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="#8b5cf6" 
                    fillOpacity={1}
                    fill="url(#colorConversations)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#colorGeneration)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#10b981" 
                    fillOpacity={1}
                    fill="url(#colorEngagement)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="font-medium mb-4">Top Performing Avatars</h3>
            <div className="space-y-4">
              {avatars
                .sort((a, b) => (b.performance || 0) - (a.performance || 0))
                .slice(0, 3)
                .map((avatar) => (
                  <div key={avatar.id} className="flex items-center gap-3">
                    <img
                      src={avatar.avatar || "/placeholder.svg"}
                      alt={`${avatar.first_name} ${avatar.last_name}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {avatar.first_name} {avatar.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{avatar.performance}% performance</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 dark:text-gray-400"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More Stats
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
