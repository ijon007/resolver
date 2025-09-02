"use server"

import { generateText } from 'ai'
import { SYSTEM_PROMPT } from '@/lib/agent/system-prompt'
import { conflictResolutionTools } from '@/lib/agent/tools'

export async function resolveConflict(
  fileContent: string,
  filename: string,
  prContext?: string
) {
  try {
    const result = await generateText({
      model: 'google/gemini-2.0-flash',
      system: SYSTEM_PROMPT,
      prompt: 
        `Resolve conflicts in file: ${filename}
      
        ${prContext ? `PR Context: ${prContext}` : ''}

        File Content with Conflicts:
        \`\`\`
        ${fileContent}
        \`\`\`

        Please analyze and resolve the conflicts using the available tools.`,
      tools: conflictResolutionTools,
    })

    // Extract the resolution from tool calls
    const resolutionToolCall = result.toolCalls.find(call => call.toolName === 'resolveConflict')
    
    if (resolutionToolCall && !resolutionToolCall.dynamic && 'resolvedContent' in resolutionToolCall.input) {
      return {
        success: true,
        data: {
          resolvedContent: resolutionToolCall.input.resolvedContent,
          explanation: resolutionToolCall.input.explanation,
          confidence: resolutionToolCall.input.confidence
        }
      }
    }

    return {
      success: false,
      error: 'No resolution tool call found in AI response'
    }
  } catch (error) {
    console.error('AI resolution error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
