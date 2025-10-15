import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, FileText, Download, Bell } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Finance Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Management</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Budgets</div>
            <p className="text-xs text-muted-foreground">
              Create and manage financial year budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rules & Regulations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Rules</div>
            <p className="text-xs text-muted-foreground">
              Upload and manage rules and regulations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">File Downloads</div>
            <p className="text-xs text-muted-foreground">
              Manage downloadable files and documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Updates</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">News & Updates</div>
            <p className="text-xs text-muted-foreground">
              Share latest updates and announcements
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Budget Management</h4>
              <p className="text-sm text-muted-foreground">
                Create new budget entries, upload financial documents, and manage yearly budgets.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Document Management</h4>
              <p className="text-sm text-muted-foreground">
                Upload and organize rules, regulations, and downloadable files.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Updates & Announcements</h4>
              <p className="text-sm text-muted-foreground">
                Share important updates and announcements with stakeholders.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">File Storage</span>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
