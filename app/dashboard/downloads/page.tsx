import { DownloadsManagementLocal } from '@/components/downloads/downloads-management-local'

export default function DownloadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Downloads</h1>
        <p className="text-gray-600">Manage downloadable files and documents (Files saved to GitHub repository)</p>
      </div>
      <DownloadsManagementLocal />
    </div>
  )
}
