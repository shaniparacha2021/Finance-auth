'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile, deleteFile } from '@/lib/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Download {
  id: string
  year: number
  description: string
  file_name?: string
  file_url?: string
  created_at: string
  updated_at: string
}

export function DownloadsManagementLocal() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDownload, setEditingDownload] = useState<Download | null>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    description: '',
    file: null as File | null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      setDownloads(data || [])
    } catch (err) {
      console.error('Error fetching downloads:', err)
      setError('Failed to fetch downloads')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      let fileName = ''
      let fileUrl = ''

      // Handle file upload if file is selected
      if (formData.file) {
        const uploadResult = await uploadFile(formData.file, 'downloads')
        fileName = uploadResult.fileName
        fileUrl = uploadResult.fileUrl
      }

      if (editingDownload) {
        // Update existing download
        const updateData: any = {
          year: formData.year,
          description: formData.description,
          updated_at: new Date().toISOString()
        }

        // Only update file if new file is uploaded
        if (formData.file) {
          // Delete old file if it exists
          if (editingDownload.file_url) {
            await deleteFile(editingDownload.file_url)
          }
          updateData.file_name = fileName
          updateData.file_url = fileUrl
        }

        const { error } = await supabase
          .from('downloads')
          .update(updateData)
          .eq('id', editingDownload.id)

        if (error) throw error
        toast.success('Download updated successfully')
      } else {
        // Create new download
        const { error } = await supabase
          .from('downloads')
          .insert({
            year: formData.year,
            description: formData.description,
            file_name: fileName,
            file_url: fileUrl
          })

        if (error) throw error
        toast.success('Download created successfully')
      }

      // Reset form and refresh data
      setFormData({ year: new Date().getFullYear(), description: '', file: null })
      setEditingDownload(null)
      setIsDialogOpen(false)
      fetchDownloads()
    } catch (err) {
      console.error('Error saving download:', err)
      setError('Failed to save download')
      toast.error('Failed to save download')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (download: Download) => {
    setEditingDownload(download)
    setFormData({
      year: download.year,
      description: download.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (download: Download) => {
    if (!confirm('Are you sure you want to delete this download?')) return

    try {
      // Delete file if it exists
      if (download.file_url) {
        await deleteFile(download.file_url)
      }

      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', download.id)

      if (error) throw error
      toast.success('Download deleted successfully')
      fetchDownloads()
    } catch (err) {
      console.error('Error deleting download:', err)
      toast.error('Failed to delete download')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const groupedDownloads = downloads.reduce((acc, download) => {
    const year = download.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(download)
    return acc
  }, {} as Record<number, Download[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading downloads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Downloads</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDownload(null)
              setFormData({ year: new Date().getFullYear(), description: '', file: null })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Download
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDownload ? 'Edit Download' : 'Add New Download'}
              </DialogTitle>
              <DialogDescription>
                {editingDownload ? 'Update download information' : 'Create a new download entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="2000"
                  max="2030"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Download description..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">File (Any Format)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
                {editingDownload?.file_name && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current file: {editingDownload.file_name}
                  </p>
                )}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingDownload ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedDownloads).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No downloads found. Create your first download entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDownloads).map(([year, yearDownloads]) => (
            <Card key={year}>
              <CardHeader>
                <CardTitle className="text-xl">{year}</CardTitle>
                <CardDescription>
                  {yearDownloads.length} download{yearDownloads.length !== 1 ? 's' : ''} for this year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearDownloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{download.description}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(download.created_at).toLocaleDateString()}
                        </p>
                        {download.file_name && (
                          <p className="text-sm text-blue-600 mt-1">
                            📄 {download.file_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {download.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(download.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(download)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(download)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
