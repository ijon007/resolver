import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/agent/system-prompt'

const conflictFileSchema = z.object({
  filename: z.string(),
  content: z.string()
})

const resolvedFileSchema = z.object({
  filename: z.string(),
  resolvedContent: z.string(),
  explanation: z.string(),
  confidence: z.number().min(0).max(1)
})

const batchResolutionSchema = z.object({
  resolvedFiles: z.array(resolvedFileSchema)
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected array of conflicted files' },
        { status: 400 }
      )
    }

    // Validate input files
    const conflictedFiles = body.map(file => conflictFileSchema.parse(file))

    if (conflictedFiles.length === 0) {
      return NextResponse.json({ resolvedFiles: [] })
    }

    // Create context for AI
    const filesContext = conflictedFiles.map(file => 
      `File: ${file.filename}\n` +
      `Content:\n\`\`\`\n${file.content}\n\`\`\``
    ).join('\n\n')

    const result = await generateObject({
      model: 'google/gemini-2.0-flash',
      system: SYSTEM_PROMPT,
      prompt: `Resolve merge conflicts in the following files. For each file, remove all conflict markers (<<<<<<<, =======, >>>>>>>) and merge the changes intelligently. Return the complete resolved content for each file.

${filesContext}

Please provide resolved content for each file with explanations and confidence scores.`,
      schema: batchResolutionSchema,
    })

    return NextResponse.json(result.object)

  } catch (error) {
    console.error('Batch AI resolution error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve conflicts' },
      { status: 500 }
    )
  }
}
