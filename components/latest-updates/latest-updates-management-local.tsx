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

interface LatestUpdate {
  id: string
  heading: string
  description: string
  file_name?: string
  file_url?: string
  created_at: string
  updated_at: string
}

export function LatestUpdatesManagementLocal() {
  const [updates, setUpdates] = useState<LatestUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<LatestUpdate | null>(null)
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    file: null as File | null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('latest_updates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUpdates(data || [])
    } catch (err) {
      console.error('Error fetching updates:', err)
      setError('Failed to fetch updates')
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
        const uploadResult = await uploadFile(formData.file, 'updates')
        fileName = uploadResult.fileName
        fileUrl = uploadResult.fileUrl
      }

      if (editingUpdate) {
        // Update existing update
        const updateData: any = {
          heading: formData.heading,
          description: formData.description,
          updated_at: new Date().toISOString()
        }

        // Only update file if new file is uploaded
        if (formData.file) {
          // Delete old file if it exists
          if (editingUpdate.file_url) {
            await deleteFile(editingUpdate.file_url)
          }
          updateData.file_name = fileName
          updateData.file_url = fileUrl
        }

        const { error } = await supabase
          .from('latest_updates')
          .update(updateData)
          .eq('id', editingUpdate.id)

        if (error) throw error
        toast.success('Update saved successfully')
      } else {
        // Create new update
        const { error } = await supabase
          .from('latest_updates')
          .insert({
            heading: formData.heading,
            description: formData.description,
            file_name: fileName,
            file_url: fileUrl
          })

        if (error) throw error
        toast.success('Update created successfully')
      }

      // Reset form and refresh data
      setFormData({ heading: '', description: '', file: null })
      setEditingUpdate(null)
      setIsDialogOpen(false)
      fetchUpdates()
    } catch (err) {
      console.error('Error saving update:', err)
      setError('Failed to save update')
      toast.error('Failed to save update')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (update: LatestUpdate) => {
    setEditingUpdate(update)
    setFormData({
      heading: update.heading,
      description: update.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (update: LatestUpdate) => {
    if (!confirm('Are you sure you want to delete this update?')) return

    try {
      // Delete file if it exists
      if (update.file_url) {
        await deleteFile(update.file_url)
      }

      const { error } = await supabase
        .from('latest_updates')
        .delete()
        .eq('id', update.id)

      if (error) throw error
      toast.success('Update deleted successfully')
      fetchUpdates()
    } catch (err) {
      console.error('Error deleting update:', err)
      toast.error('Failed to delete update')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading updates...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Latest Updates</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUpdate(null)
              setFormData({ heading: '', description: '', file: null })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUpdate ? 'Edit Update' : 'Add New Update'}
              </DialogTitle>
              <DialogDescription>
                {editingUpdate ? 'Update the information' : 'Create a new update entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="Update heading..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Update description..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {editingUpdate?.file_name && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current file: {editingUpdate.file_name}
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
                  {submitting ? 'Saving...' : editingUpdate ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {updates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No updates found. Create your first update.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{update.heading}</h3>
                    <p className="text-gray-600 mb-3">{update.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(update.created_at).toLocaleDateString()}
                    </p>
                    {update.file_name && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(update.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {update.file_name}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(update)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(update)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
