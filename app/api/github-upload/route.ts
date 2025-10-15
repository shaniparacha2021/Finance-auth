import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = 'shaniparacha2021'
const GITHUB_REPO = 'Finance-auth'

export async function POST(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const fileName = `${timestamp}-${originalName}`
    
    // Convert file to base64 for GitHub API
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString('base64')

    // Create file path in GitHub repository
    const filePath = `public/uploads/${bucket}/${fileName}`
    const commitMessage = `Add ${originalName} to ${bucket}`

    // Upload to GitHub using the API
    const githubResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch: 'main'
        })
      }
    )

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      console.error('GitHub API error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to upload to GitHub', 
        details: errorData.message 
      }, { status: 500 })
    }

    const githubData = await githubResponse.json()

    // Return the GitHub file URL
    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`

    return NextResponse.json({
      fileName,
      filePath,
      fileUrl,
      githubSha: githubData.content.sha,
      githubUrl: githubData.content.html_url
    })
  } catch (error) {
    console.error('GitHub upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file to GitHub' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')
    const sha = searchParams.get('sha')

    if (!filePath || !sha) {
      return NextResponse.json({ error: 'File path and SHA required' }, { status: 400 })
    }

    // Delete from GitHub using the API
    const githubResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete ${filePath}`,
          sha: sha,
          branch: 'main'
        })
      }
    )

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      console.error('GitHub delete error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to delete from GitHub', 
        details: errorData.message 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GitHub delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file from GitHub' }, { status: 500 })
  }
}
