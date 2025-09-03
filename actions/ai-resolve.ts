"use server"

import { generateObject } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/agent/system-prompt'

const conflictResolutionSchema = z.object({
  resolvedContent: z.string().describe('The complete resolved file content with all conflicts removed'),
  explanation: z.string().describe('Detailed explanation of the resolution approach and decisions made'),
  confidence: z.number().min(0).max(1).describe('Confidence score from 0 to 1'),
  changesSummary: z.string().describe('Summary of what changes were made during resolution')
})

export async function resolveConflict(
  fileContent: string,
  filename: string,
  prContext?: string
) {
  try {
    const result = await generateObject({
      model: 'google/gemini-2.0-flash',
      system: SYSTEM_PROMPT,
      prompt: 
        `Resolve conflicts in file: ${filename}
      
        ${prContext ? `PR Context: ${prContext}` : ''}

        File Content with Conflicts:
        \`\`\`
        ${fileContent}
        \`\`\`

        Please analyze and resolve the conflicts. Provide the complete resolved content with all conflict markers removed, along with a detailed explanation of your approach and a confidence score.`,
      schema: conflictResolutionSchema,
    })

    return {
      success: true,
      data: {
        resolvedContent: result.object.resolvedContent,
        explanation: result.object.explanation,
        confidence: result.object.confidence
      }
    }
  } catch (error) {
    console.error('AI resolution error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
