import { RulesRegulationsManagementLocal } from '@/components/rules-regulations/rules-regulations-management-local'

export default function RulesRegulationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rules & Regulations</h1>
        <p className="text-gray-600">Manage rules and regulations documents (Files saved to GitHub repository)</p>
      </div>
      <RulesRegulationsManagementLocal />
    </div>
  )
}
