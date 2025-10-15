import { NextRequest, NextResponse } from 'next/server'

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

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const fileName = `${timestamp}-${originalName}`
    
    // Convert File to base64 for storage in database
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Data}`

    // Return the file information
    // The file will be stored as base64 in the database and served via a data URL
    return NextResponse.json({
      fileName,
      filePath: `${BUCKETS[bucket]}/${fileName}`,
      fileUrl: dataUrl,
      fileSize: file.size,
      fileType: file.type
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

    // For base64 data URLs, we don't need to delete anything from filesystem
    // The file is stored in the database and will be removed when the record is deleted
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('File deletion error:', error)
    return NextResponse.json({ success: true })
  }
}
