'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Budget, BudgetInsert, BudgetUpdate } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function BudgetManagement() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    financial_year: '',
    description: '',
    file: null as File | null
  })
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
    } catch (error) {
      toast.error('Failed to fetch budgets')
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
          .from('budget-files')
          .upload(uploadFileName, formData.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('budget-files')
          .getPublicUrl(uploadFileName)

        fileUrl = publicUrl
        fileName = formData.file.name
      }

      const budgetData: BudgetInsert = {
        financial_year: formData.financial_year,
        description: formData.description,
        file_url: fileUrl,
        file_name: fileName
      }

      if (editingBudget) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update(budgetData)
          .eq('id', editingBudget.id)

        if (error) throw error
        toast.success('Budget updated successfully')
      } else {
        // Create new budget
        const { error } = await supabase
          .from('budgets')
          .insert(budgetData)

        if (error) throw error
        toast.success('Budget created successfully')
      }

      setIsDialogOpen(false)
      setFormData({ financial_year: '', description: '', file: null })
      setEditingBudget(null)
      fetchBudgets()
    } catch (error) {
      toast.error('Failed to save budget')
    } finally {
      setLoading(false)
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
      // Delete file from storage if exists
      if (budget.file_url) {
        const fileName = budget.file_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('budget-files')
            .remove([fileName])
        }
      }

      // Delete budget record
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budget.id)

      if (error) throw error
      toast.success('Budget deleted successfully')
      fetchBudgets()
    } catch (error) {
      toast.error('Failed to delete budget')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const groupedBudgets = budgets.reduce((acc, budget) => {
    if (!acc[budget.financial_year]) {
      acc[budget.financial_year] = []
    }
    acc[budget.financial_year].push(budget)
    return acc
  }, {} as Record<string, Budget[]>)

  if (loading && budgets.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Budget Records</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBudget(null)
              setFormData({ financial_year: '', description: '', file: null })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
              <DialogDescription>
                {editingBudget ? 'Update budget information' : 'Create a new budget entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="financial_year">Financial Year</Label>
                <Input
                  id="financial_year"
                  placeholder="e.g., 2022-23"
                  value={formData.financial_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, financial_year: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Budget description..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload (PDF or Word)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingBudget ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedBudgets).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets found</h3>
            <p className="text-gray-500 text-center">Get started by creating your first budget entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBudgets).map(([year, yearBudgets]) => (
            <div key={year}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{year}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {yearBudgets.map((budget) => (
                  <Card key={budget.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{budget.financial_year}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {budget.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {budget.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(budget.file_url!, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {budget.file_name && (
                        <p className="text-sm text-gray-500 mt-2 truncate">
                          {budget.file_name}
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
