'use client'

import { BudgetManagementLocal } from '@/components/budget/budget-management-local'
import { RulesRegulationsManagementLocal } from '@/components/rules-regulations/rules-regulations-management-local'
import { DownloadsManagementLocal } from '@/components/downloads/downloads-management-local'
import { LatestUpdatesManagementLocal } from '@/components/latest-updates/latest-updates-management-local'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Database, Upload, Download } from 'lucide-react'

export default function TestAllLocalStoragePage() {
  const [activeTab, setActiveTab] = useState('budget')

  const tabs = [
    { id: 'budget', label: 'Budget', icon: FileText },
    { id: 'rules', label: 'Rules & Regulations', icon: FileText },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'updates', label: 'Latest Updates', icon: Upload }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GitHub File Storage Test</h1>
          <p className="mt-2 text-gray-600">
            All files are saved directly to your GitHub repository in the <code className="bg-gray-100 px-2 py-1 rounded">public/uploads/</code> directory.
          </p>
        </div>

        {/* File Storage Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              File Storage Structure
            </CardTitle>
            <CardDescription>
              Files are organized in your repository as follows:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">File Directories:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>📁 <code>public/uploads/budget-files/</code></li>
                  <li>📁 <code>public/uploads/rules-files/</code></li>
                  <li>📁 <code>public/uploads/download-files/</code></li>
                  <li>📁 <code>public/uploads/update-files/</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Database Storage:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• File names and URLs only</li>
                  <li>• No binary data in database</li>
                  <li>• Fast queries and small database</li>
                  <li>• Version controlled files</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'budget' && <BudgetManagementLocal />}
          {activeTab === 'rules' && <RulesRegulationsManagementLocal />}
          {activeTab === 'downloads' && <DownloadsManagementLocal />}
          {activeTab === 'updates' && <LatestUpdatesManagementLocal />}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>
              Test the file storage system with these steps:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Click on any tab above to switch between different file types</li>
              <li>Click "Add [Type]" to create a new entry</li>
              <li>Upload a file (PDF, Word, Image, etc.)</li>
              <li>Fill in the required information</li>
              <li>Click "Create" to save</li>
              <li>Check your file system at <code className="bg-gray-100 px-1 rounded">public/uploads/</code> to see the uploaded files</li>
              <li>Files are now part of your GitHub repository</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
