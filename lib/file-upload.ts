// File upload configuration
const BUCKETS = {
  budgets: 'budget-files',
  rules: 'rules-files', 
  downloads: 'download-files',
  updates: 'update-files'
}

export async function uploadFile(
  file: File,
  bucket: keyof typeof BUCKETS,
  customName?: string
): Promise<{ fileName: string; filePath: string; fileUrl: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload file')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('File upload error:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const response = await fetch(`/api/upload?fileUrl=${encodeURIComponent(fileUrl)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      console.error('File deletion failed')
    }
  } catch (error) {
    console.error('File deletion error:', error)
    // Don't throw error if file doesn't exist
  }
}

export function getFileUrl(fileName: string, bucket: keyof typeof BUCKETS): string {
  return `/uploads/${BUCKETS[bucket]}/${fileName}`
}
