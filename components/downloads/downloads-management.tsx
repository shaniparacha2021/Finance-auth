'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Download as DownloadType, DownloadInsert, DownloadUpdate } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function DownloadsManagement() {
  const [downloads, setDownloads] = useState<DownloadType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDownload, setEditingDownload] = useState<DownloadType | null>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    description: '',
    file: null as File | null
  })
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
    } catch (error) {
      toast.error('Failed to fetch downloads')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let fileUrl = null
      let fileName = null

      // Handle file upload if present
      if (formData.file) {
        const fileExt = formData.file.name.split('.').pop()
        const uploadFileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('download-files')
          .upload(uploadFileName, formData.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('download-files')
          .getPublicUrl(uploadFileName)

        fileUrl = publicUrl
        fileName = formData.file.name
      }

      const downloadData: DownloadInsert = {
        year: formData.year,
        description: formData.description,
        file_url: fileUrl,
        file_name: fileName
      }

      if (editingDownload) {
        // Update existing download
        const { error } = await supabase
          .from('downloads')
          .update(downloadData)
          .eq('id', editingDownload.id)

        if (error) throw error
        toast.success('Download updated successfully')
      } else {
        // Create new download
        const { error } = await supabase
          .from('downloads')
          .insert(downloadData)

        if (error) throw error
        toast.success('Download created successfully')
      }

      setIsDialogOpen(false)
      setFormData({ year: new Date().getFullYear(), description: '', file: null })
      setEditingDownload(null)
      fetchDownloads()
    } catch (error) {
      toast.error('Failed to save download')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (download: DownloadType) => {
    setEditingDownload(download)
    setFormData({
      year: download.year,
      description: download.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (download: DownloadType) => {
    if (!confirm('Are you sure you want to delete this download?')) return

    try {
      // Delete file from storage if exists
      if (download.file_url) {
        const fileName = download.file_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('download-files')
            .remove([fileName])
        }
      }

      // Delete download record
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', download.id)

      if (error) throw error
      toast.success('Download deleted successfully')
      fetchDownloads()
    } catch (error) {
      toast.error('Failed to delete download')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const groupedDownloads = downloads.reduce((acc, download) => {
    if (!acc[download.year]) {
      acc[download.year] = []
    }
    acc[download.year].push(download)
    return acc
  }, {} as Record<number, DownloadType[]>)

  if (loading && downloads.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Download Files</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDownload(null)
              setFormData({ year: new Date().getFullYear(), description: '', file: null })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Download
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDownload ? 'Edit Download' : 'Add New Download'}</DialogTitle>
              <DialogDescription>
                {editingDownload ? 'Update download information' : 'Create a new download entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max="2030"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Download description..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload (Any format)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingDownload ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedDownloads).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads found</h3>
            <p className="text-gray-500 text-center">Get started by creating your first download entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDownloads).map(([year, yearDownloads]) => (
            <div key={year}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{year}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {yearDownloads.map((download) => (
                  <Card key={download.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">Download {download.year}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {download.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {download.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(download.file_url!, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {download.file_name && (
                        <p className="text-sm text-gray-500 mt-2 truncate">
                          {download.file_name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
