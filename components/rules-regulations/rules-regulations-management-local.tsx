'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile, deleteFile } from '@/lib/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface RulesRegulation {
  id: string
  year: number
  type: 'Rules' | 'Regulations'
  description: string
  file_name?: string
  file_url?: string
  created_at: string
  updated_at: string
}

export function RulesRegulationsManagementLocal() {
  const [rulesRegulations, setRulesRegulations] = useState<RulesRegulation[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<RulesRegulation | null>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    type: 'Rules' as 'Rules' | 'Regulations',
    description: '',
    file: null as File | null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchRulesRegulations()
  }, [])

  const fetchRulesRegulations = async () => {
    try {
      const { data, error } = await supabase
        .from('rules_regulations')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      setRulesRegulations(data || [])
    } catch (err) {
      console.error('Error fetching rules & regulations:', err)
      setError('Failed to fetch rules & regulations')
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
        const uploadResult = await uploadFile(formData.file, 'rules')
        fileName = uploadResult.fileName
        fileUrl = uploadResult.fileUrl
      }

      if (editingRule) {
        // Update existing rule
        const updateData: any = {
          year: formData.year,
          type: formData.type,
          description: formData.description,
          updated_at: new Date().toISOString()
        }

        // Only update file if new file is uploaded
        if (formData.file) {
          // Delete old file if it exists
          if (editingRule.file_url) {
            await deleteFile(editingRule.file_url)
          }
          updateData.file_name = fileName
          updateData.file_url = fileUrl
        }

        const { error } = await supabase
          .from('rules_regulations')
          .update(updateData)
          .eq('id', editingRule.id)

        if (error) throw error
        toast.success('Rule/Regulation updated successfully')
      } else {
        // Create new rule
        const { error } = await supabase
          .from('rules_regulations')
          .insert({
            year: formData.year,
            type: formData.type,
            description: formData.description,
            file_name: fileName,
            file_url: fileUrl
          })

        if (error) throw error
        toast.success('Rule/Regulation created successfully')
      }

      // Reset form and refresh data
      setFormData({ year: new Date().getFullYear(), type: 'Rules', description: '', file: null })
      setEditingRule(null)
      setIsDialogOpen(false)
      fetchRulesRegulations()
    } catch (err) {
      console.error('Error saving rule/regulation:', err)
      setError('Failed to save rule/regulation')
      toast.error('Failed to save rule/regulation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (rule: RulesRegulation) => {
    setEditingRule(rule)
    setFormData({
      year: rule.year,
      type: rule.type,
      description: rule.description,
      file: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (rule: RulesRegulation) => {
    if (!confirm('Are you sure you want to delete this rule/regulation?')) return

    try {
      // Delete file if it exists
      if (rule.file_url) {
        await deleteFile(rule.file_url)
      }

      const { error } = await supabase
        .from('rules_regulations')
        .delete()
        .eq('id', rule.id)

      if (error) throw error
      toast.success('Rule/Regulation deleted successfully')
      fetchRulesRegulations()
    } catch (err) {
      console.error('Error deleting rule/regulation:', err)
      toast.error('Failed to delete rule/regulation')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const groupedRules = rulesRegulations.reduce((acc, rule) => {
    const year = rule.year
    if (!acc[year]) {
      acc[year] = { Rules: [], Regulations: [] }
    }
    acc[year][rule.type].push(rule)
    return acc
  }, {} as Record<number, { Rules: RulesRegulation[], Regulations: RulesRegulation[] }>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading rules & regulations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rules & Regulations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRule(null)
              setFormData({ year: new Date().getFullYear(), type: 'Rules', description: '', file: null })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule/Regulation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Rule/Regulation' : 'Add New Rule/Regulation'}
              </DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update rule/regulation information' : 'Create a new rule/regulation entry'}
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
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'Rules' | 'Regulations') => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rules">Rules</SelectItem>
                    <SelectItem value="Regulations">Regulations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Rule/regulation description..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">File (PDF, Word, Image)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {editingRule?.file_name && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current file: {editingRule.file_name}
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
                  {submitting ? 'Saving...' : editingRule ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedRules).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No rules & regulations found. Create your first entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRules).map(([year, yearRules]) => (
            <Card key={year}>
              <CardHeader>
                <CardTitle className="text-xl">{year}</CardTitle>
                <CardDescription>
                  {yearRules.Rules.length + yearRules.Regulations.length} entr{yearRules.Rules.length + yearRules.Regulations.length !== 1 ? 'ies' : 'y'} for this year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearRules.Rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Rules</span>
                        </div>
                        <h3 className="font-medium">{rule.description}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(rule.created_at).toLocaleDateString()}
                        </p>
                        {rule.file_name && (
                          <p className="text-sm text-blue-600 mt-1">
                            📄 {rule.file_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {rule.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(rule.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rule)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {yearRules.Regulations.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Regulations</span>
                        </div>
                        <h3 className="font-medium">{rule.description}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(rule.created_at).toLocaleDateString()}
                        </p>
                        {rule.file_name && (
                          <p className="text-sm text-blue-600 mt-1">
                            📄 {rule.file_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {rule.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(rule.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rule)}
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
