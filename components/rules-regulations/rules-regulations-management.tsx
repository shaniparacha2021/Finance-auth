'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RulesRegulation, RulesRegulationInsert, RulesRegulationUpdate } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function RulesRegulationsManagement() {
  const [rules, setRules] = useState<RulesRegulation[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<RulesRegulation | null>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    type: 'Rules' as 'Rules' | 'Regulations',
    description: '',
    file: null as File | null
  })
  const supabase = createClient()

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('rules_regulations')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      toast.error('Failed to fetch rules and regulations')
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
          .from('rules-files')
          .upload(uploadFileName, formData.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('rules-files')
          .getPublicUrl(uploadFileName)

        fileUrl = publicUrl
        fileName = formData.file.name
      }

      const ruleData: RulesRegulationInsert = {
        year: formData.year,
        type: formData.type,
        description: formData.description,
        file_url: fileUrl,
        file_name: fileName
      }

      if (editingRule) {
        // Update existing rule
        const { error } = await supabase
          .from('rules_regulations')
          .update(ruleData)
          .eq('id', editingRule.id)

        if (error) throw error
        toast.success('Rule/Regulation updated successfully')
      } else {
        // Create new rule
        const { error } = await supabase
          .from('rules_regulations')
          .insert(ruleData)

        if (error) throw error
        toast.success('Rule/Regulation created successfully')
      }

      setIsDialogOpen(false)
      setFormData({ year: new Date().getFullYear(), type: 'Rules', description: '', file: null })
      setEditingRule(null)
      fetchRules()
    } catch (error) {
      toast.error('Failed to save rule/regulation')
    } finally {
      setLoading(false)
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
      // Delete file from storage if exists
      if (rule.file_url) {
        const fileName = rule.file_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('rules-files')
            .remove([fileName])
        }
      }

      // Delete rule record
      const { error } = await supabase
        .from('rules_regulations')
        .delete()
        .eq('id', rule.id)

      if (error) throw error
      toast.success('Rule/Regulation deleted successfully')
      fetchRules()
    } catch (error) {
      toast.error('Failed to delete rule/regulation')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.year]) {
      acc[rule.year] = { Rules: [], Regulations: [] }
    }
    acc[rule.year][rule.type].push(rule)
    return acc
  }, {} as Record<number, { Rules: RulesRegulation[], Regulations: RulesRegulation[] }>)

  if (loading && rules.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Rules & Regulations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRule(null)
              setFormData({ year: new Date().getFullYear(), type: 'Rules', description: '', file: null })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule/Regulation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Rule/Regulation' : 'Add New Rule/Regulation'}</DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update rule/regulation information' : 'Create a new rule/regulation entry'}
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
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Rule/Regulation description..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload (PDF, Word, or Image)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingRule ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedRules).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rules/regulations found</h3>
            <p className="text-gray-500 text-center">Get started by creating your first rule or regulation entry.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRules).map(([year, yearRules]) => (
            <div key={year}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{year}</h3>
              <div className="space-y-6">
                {['Rules', 'Regulations'].map((type) => {
                  const typeRules = yearRules[type as keyof typeof yearRules]
                  if (typeRules.length === 0) return null
                  
                  return (
                    <div key={type}>
                      <h4 className="text-lg font-medium text-gray-700 mb-3">{type}</h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {typeRules.map((rule) => (
                          <Card key={rule.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{rule.type}</CardTitle>
                              <CardDescription className="line-clamp-3">
                                {rule.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
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
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                {rule.file_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(rule.file_url!, '_blank')}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              {rule.file_name && (
                                <p className="text-sm text-gray-500 mt-2 truncate">
                                  {rule.file_name}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
