'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile, deleteFile, getFileUrl } from '@/lib/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Budget {
  id: string
  financial_year: string
  description: string
  file_name?: string
  file_url?: string
  created_at: string
  updated_at: string
}

export function BudgetManagementLocal() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    financial_year: '',
    description: '',
    file: null as File | null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('financial_year', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError('Failed to fetch budgets')
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
      let fileData = ''
      let fileSize = 0
      let fileType = ''

      // Handle file upload if file is selected
      if (formData.file) {
        const uploadResult = await uploadFile(formData.file, 'budgets')
        fileName = uploadResult.fileName
        fileUrl = uploadResult.fileUrl
        fileData = uploadResult.fileUrl // This is now a base64 data URL
        fileSize = uploadResult.fileSize || 0
        fileType = uploadResult.fileType || ''
      }

      if (editingBudget) {
        // Update existing budget
        const updateData: any = {
          financial_year: formData.financial_year,
          description: formData.description,
          updated_at: new Date().toISOString()
        }

        // Only update file if new file is uploaded
        if (formData.file) {
          updateData.file_name = fileName
          updateData.file_url = fileUrl
          updateData.file_data = fileData
          updateData.file_size = fileSize
          updateData.file_type = fileType
        }

        const { error } = await supabase
          .from('budgets')
          .update(updateData)
          .eq('id', editingBudget.id)

        if (error) throw error
        toast.success('Budget updated successfully')
      } else {
        // Create new budget
        const { error } = await supabase
          .from('budgets')
          .insert({
            financial_year: formData.financial_year,
            description: formData.description,
            file_name: fileName || null,
            file_url: fileUrl || null,
            file_data: fileData || null,
            file_size: fileSize || null,
            file_type: fileType || null
          })

        if (error) throw error
        toast.success('Budget created successfully')
      }

      // Reset form and refresh data
      setFormData({ financial_year: '', description: '', file: null })
      setEditingBudget(null)
      setIsDialogOpen(false)
      fetchBudgets()
    } catch (err) {
      console.error('Error saving budget:', err)
      setError('Failed to save budget')
      toast.error('Failed to save budget')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      financial_year: budget.financial_year,
      description: budget.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (budget: Budget) => {
    if (!confirm('Are you sure you want to delete this budget?')) return

    try {
      // For base64 storage, we don't need to delete files separately
      // The file data is stored in the database and will be removed with the record

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budget.id)

      if (error) throw error
      toast.success('Budget deleted successfully')
      fetchBudgets()
    } catch (err) {
      console.error('Error deleting budget:', err)
      toast.error('Failed to delete budget')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const groupedBudgets = budgets.reduce((acc, budget) => {
    const year = budget.financial_year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(budget)
    return acc
  }, {} as Record<string, Budget[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading budgets...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBudget(null)
              setFormData({ financial_year: '', description: '', file: null })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget ? 'Update budget information' : 'Create a new budget entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="financial_year">Financial Year</Label>
                <Input
                  id="financial_year"
                  value={formData.financial_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, financial_year: e.target.value }))}
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Budget description..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">File (PDF, Word)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {editingBudget?.file_name && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current file: {editingBudget.file_name}
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
                  {submitting ? 'Saving...' : editingBudget ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedBudgets).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No budgets found. Create your first budget entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBudgets).map(([year, yearBudgets]) => (
            <Card key={year}>
              <CardHeader>
                <CardTitle className="text-xl">{year}</CardTitle>
                <CardDescription>
                  {yearBudgets.length} budget{yearBudgets.length !== 1 ? 's' : ''} for this year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearBudgets.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{budget.description}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(budget.created_at).toLocaleDateString()}
                        </p>
                        {budget.file_name && (
                          <p className="text-sm text-blue-600 mt-1">
                            📄 {budget.file_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {budget.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(budget.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(budget)}
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
