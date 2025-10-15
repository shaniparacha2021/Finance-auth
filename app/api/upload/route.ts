import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const BUCKETS = {
  budgets: 'budget-files',
  rules: 'rules-files', 
  downloads: 'download-files',
  updates: 'update-files'
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as keyof typeof BUCKETS

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!bucket || !BUCKETS[bucket]) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }

    // Create directory if it doesn't exist
    const bucketDir = join(UPLOAD_DIR, BUCKETS[bucket])
    await mkdir(bucketDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop()
    const fileName = `${timestamp}-${originalName}`
    
    // Create file path
    const filePath = join(bucketDir, fileName)
    const fileUrl = `/uploads/${BUCKETS[bucket]}/${fileName}`

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      fileName,
      filePath,
      fileUrl
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('fileUrl')

    if (!fileUrl) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
    }

    const { unlink } = await import('fs/promises')
    const filePath = join(process.cwd(), 'public', fileUrl)
    await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('File deletion error:', error)
    // Don't throw error if file doesn't exist
    return NextResponse.json({ success: true })
  }
}
