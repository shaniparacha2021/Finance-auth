'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadFile } from '@/lib/file-upload'
import { createClient } from '@/lib/supabase/client'

export default function TestBudgetUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [dbResult, setDbResult] = useState<any>(null)

  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError('')
    }
  }

  const testFileUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Testing file upload...')
      const uploadResult = await uploadFile(file, 'budgets')
      console.log('Upload result:', uploadResult)
      setResult(uploadResult)
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testDatabaseInsert = async () => {
    if (!result) {
      setError('Please upload a file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Testing database insert...')
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          financial_year: '2024-2025',
          description: 'Test budget from upload test',
          file_name: result.fileName,
          file_url: result.fileUrl
        })
        .select()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Database result:', data)
      setDbResult(data)
    } catch (err) {
      console.error('Database error:', err)
      setError(`Database insert failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Budget File Upload</CardTitle>
          <CardDescription>
            Test the file upload and database functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name} ({file.size} bytes)
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={testFileUpload} 
              disabled={!file || loading}
            >
              {loading ? 'Testing...' : 'Test File Upload'}
            </Button>
            
            <Button 
              onClick={testDatabaseInsert} 
              disabled={!result || loading}
              variant="outline"
            >
              Test Database Insert
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <h3 className="font-semibold">Upload Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {dbResult && (
            <div className="space-y-4">
              <h3 className="font-semibold">Database Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(dbResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
