'use client'

import { useState } from 'react'
import { BudgetManagementLocal } from '@/components/budget/budget-management-local'

export default function TestLocalStoragePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Local File Storage Test</h1>
          <p className="mt-2 text-gray-600">
            This page demonstrates file storage using GitHub repository instead of Supabase Storage.
            Files are saved in the <code className="bg-gray-100 px-2 py-1 rounded">public/uploads/</code> directory.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How it works:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Files are uploaded to <code className="bg-gray-100 px-1 rounded">public/uploads/</code> directory</li>
            <li>File names and paths are stored in the database</li>
            <li>Files are served as static assets from your Next.js app</li>
            <li>Files are included in your GitHub repository</li>
            <li>Version control tracks file changes</li>
          </ul>
        </div>

        <div className="mt-8">
          <BudgetManagementLocal />
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">File Storage Location:</h3>
          <p className="text-blue-800 text-sm">
            Files are stored in: <code className="bg-blue-100 px-2 py-1 rounded">public/uploads/budget-files/</code>
          </p>
          <p className="text-blue-800 text-sm mt-2">
            Database stores: file name and relative URL path for retrieval
          </p>
        </div>
      </div>
    </div>
  )
}
