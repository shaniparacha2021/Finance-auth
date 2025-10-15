'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LatestUpdate, LatestUpdateInsert, LatestUpdateUpdate } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Download, Bell, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function LatestUpdatesManagement() {
  const [updates, setUpdates] = useState<LatestUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<LatestUpdate | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    file: null as File | null
  })
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
    } catch (error) {
      toast.error('Failed to fetch updates')
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
          .from('update-files')
          .upload(uploadFileName, formData.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('update-files')
          .getPublicUrl(uploadFileName)

        fileUrl = publicUrl
        fileName = formData.file.name
      }

      const updateData: LatestUpdateInsert = {
        description: formData.description,
        file_url: fileUrl,
        file_name: fileName
      }

      if (editingUpdate) {
        // Update existing update
        const { error } = await supabase
          .from('latest_updates')
          .update(updateData)
          .eq('id', editingUpdate.id)

        if (error) throw error
        toast.success('Update updated successfully')
      } else {
        // Create new update
        const { error } = await supabase
          .from('latest_updates')
          .insert(updateData)

        if (error) throw error
        toast.success('Update created successfully')
      }

      setIsDialogOpen(false)
      setFormData({ description: '', file: null })
      setEditingUpdate(null)
      fetchUpdates()
    } catch (error) {
      toast.error('Failed to save update')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (update: LatestUpdate) => {
    setEditingUpdate(update)
    setFormData({
      description: update.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (update: LatestUpdate) => {
    if (!confirm('Are you sure you want to delete this update?')) return

    try {
      // Delete file from storage if exists
      if (update.file_url) {
        const fileName = update.file_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('update-files')
            .remove([fileName])
        }
      }

      // Delete update record
      const { error } = await supabase
        .from('latest_updates')
        .delete()
        .eq('id', update.id)

      if (error) throw error
      toast.success('Update deleted successfully')
      fetchUpdates()
    } catch (error) {
      toast.error('Failed to delete update')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && updates.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Latest Updates</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUpdate(null)
              setFormData({ description: '', file: null })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUpdate ? 'Edit Update' : 'Add New Update'}</DialogTitle>
              <DialogDescription>
                {editingUpdate ? 'Update announcement information' : 'Create a new update announcement'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Update description..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload (Optional)</Label>
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
                  {editingUpdate ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {updates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
            <p className="text-gray-500 text-center">Get started by creating your first update announcement.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Update</CardTitle>
                  </div>
                  <div className="flex space-x-2">
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
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-500">
                  {formatDate(update.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {update.description}
                </p>
                {update.file_url && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{update.file_name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(update.file_url!, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
