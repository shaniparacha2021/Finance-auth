import { BudgetManagementLocal } from '@/components/budget/budget-management-local'

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
        <p className="text-gray-600">Manage financial year budgets and documents (Files saved to GitHub repository)</p>
      </div>
      <BudgetManagementLocal />
    </div>
  )
}
