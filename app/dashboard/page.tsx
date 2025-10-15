'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  FileText, 
  Download, 
  Bell, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
  Plus
} from 'lucide-react'

interface DashboardStats {
  totalBudgets: number
  totalRules: number
  totalDownloads: number
  totalUpdates: number
  recentActivity: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBudgets: 0,
    totalRules: 0,
    totalDownloads: 0,
    totalUpdates: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const supabase = createClient()
      
      // Fetch counts from all tables
      const [budgetsResult, rulesResult, downloadsResult, updatesResult] = await Promise.all([
        supabase.from('budgets').select('*', { count: 'exact', head: true }),
        supabase.from('rules_regulations').select('*', { count: 'exact', head: true }),
        supabase.from('downloads').select('*', { count: 'exact', head: true }),
        supabase.from('latest_updates').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalBudgets: budgetsResult.count || 0,
        totalRules: rulesResult.count || 0,
        totalDownloads: downloadsResult.count || 0,
        totalUpdates: updatesResult.count || 0,
        recentActivity: (budgetsResult.count || 0) + (rulesResult.count || 0) + (downloadsResult.count || 0) + (updatesResult.count || 0)
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Budgets",
      value: stats.totalBudgets,
      description: "Financial year budgets",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      change: "+12% from last month"
    },
    {
      title: "Rules & Regulations",
      value: stats.totalRules,
      description: "Active rules and regulations",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      change: "+8% from last month"
    },
    {
      title: "Downloads",
      value: stats.totalDownloads,
      description: "Available downloads",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      change: "+15% from last month"
    },
    {
      title: "Latest Updates",
      value: stats.totalUpdates,
      description: "Recent updates posted",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      change: "+3% from last month"
    }
  ]

  const quickActions = [
    {
      title: "Add New Budget",
      description: "Create a new financial year budget",
      href: "/dashboard/budget",
      icon: DollarSign,
      color: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Upload Rules",
      description: "Add new rules and regulations",
      href: "/dashboard/rules-regulations",
      icon: FileText,
      color: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Add Download",
      description: "Upload new downloadable files",
      href: "/dashboard/downloads",
      icon: Download,
      color: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Post Update",
      description: "Create a new update announcement",
      href: "/dashboard/latest-updates",
      icon: Bell,
      color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Finance Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your finance management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className={`relative overflow-hidden border-l-4 ${stat.borderColor} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Card key={index} className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${action.color} text-white transition-colors`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {action.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Button 
                    className="w-full group-hover:bg-gray-100" 
                    variant="outline"
                    onClick={() => window.location.href = action.href}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Go to {action.title.split(' ')[1]}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates and changes in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New budget added</p>
                  <p className="text-xs text-gray-500">Financial Year 2024-25</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Rules updated</p>
                  <p className="text-xs text-gray-500">Regulation Type: Financial</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Download className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New download added</p>
                  <p className="text-xs text-gray-500">Annual Report 2024</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>System Overview</span>
            </CardTitle>
            <CardDescription>
              Key metrics and system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <PieChart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">System Health</p>
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">100%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Active Users</p>
                    <p className="text-xs text-gray-500">Currently online</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Backup</p>
                    <p className="text-xs text-gray-500">Database backup</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-orange-600">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}