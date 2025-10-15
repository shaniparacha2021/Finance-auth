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
): Promise<{ fileName: string; filePath: string; fileUrl: string; githubSha?: string; githubUrl?: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)

    // Try GitHub upload first
    const response = await fetch('/api/github-upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('GitHub upload failed:', error)
      
      // Fallback to local storage if GitHub fails
      const fallbackResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!fallbackResponse.ok) {
        const fallbackError = await fallbackResponse.json()
        throw new Error(fallbackError.error || 'Failed to upload file')
      }

      const fallbackResult = await fallbackResponse.json()
      return fallbackResult
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('File upload error:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(fileUrl: string, filePath?: string, sha?: string): Promise<void> {
  try {
    // Try GitHub delete first if we have the required parameters
    if (filePath && sha) {
      const response = await fetch(`/api/github-upload?filePath=${encodeURIComponent(filePath)}&sha=${encodeURIComponent(sha)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        return
      }
    }

    // Fallback to local delete
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
