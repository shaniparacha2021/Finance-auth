import { LatestUpdatesManagementLocal } from '@/components/latest-updates/latest-updates-management-local'

export default function LatestUpdatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Latest Updates</h1>
        <p className="text-gray-600">Manage latest updates with heading, description, and optional file (Files saved to GitHub repository)</p>
      </div>
      <LatestUpdatesManagementLocal />
    </div>
  )
}
