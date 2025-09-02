import { tool } from 'ai'
import { z } from 'zod'

export const conflictResolutionTools = {
  analyzeConflict: tool({
    description: 'Analyze the type and complexity of a merge conflict in code',
    inputSchema: z.object({
      conflictType: z.enum(['semantic', 'syntax', 'import', 'format', 'logic']).describe('Type of conflict detected'),
      complexity: z.enum(['simple', 'moderate', 'complex']).describe('Complexity level of the conflict'),
      affectedLines: z.number().describe('Number of lines affected by the conflict'),
      description: z.string().describe('Brief description of what the conflict involves')
    }),
    execute: async ({ conflictType, complexity, affectedLines, description }) => {
      return {
        analysis: {
          type: conflictType,
          complexity,
          affectedLines,
          description
        }
      }
    }
  }),

  resolveConflict: tool({
    description: 'Provide the final resolved content for a file with conflicts removed',
    inputSchema: z.object({
      resolvedContent: z.string().describe('The complete resolved file content with all conflicts removed'),
      explanation: z.string().describe('Detailed explanation of the resolution approach and decisions made'),
      confidence: z.number().min(0).max(1).describe('Confidence score from 0 to 1'),
      changesSummary: z.string().describe('Summary of what changes were made during resolution')
    }),
    execute: async ({ resolvedContent, explanation, confidence, changesSummary }) => {
      return {
        resolution: {
          content: resolvedContent,
          explanation,
          confidence,
          changesSummary
        }
      }
    }
  }),

  validateResolution: tool({
    description: 'Validate the quality and correctness of a resolution',
    inputSchema: z.object({
      syntaxValid: z.boolean().describe('Whether the resolved code is syntactically valid'),
      logicPreserved: z.boolean().describe('Whether the original logic from both sides is preserved'),
      styleConsistent: z.boolean().describe('Whether the code style is consistent'),
      issues: z.array(z.string()).describe('List of any issues or concerns with the resolution')
    }),
    execute: async ({ syntaxValid, logicPreserved, styleConsistent, issues }) => {
      return {
        validation: {
          syntaxValid,
          logicPreserved,
          styleConsistent,
          issues,
          overallValid: syntaxValid && logicPreserved && styleConsistent && issues.length === 0
        }
      }
    }
  }),

  getContext: tool({
    description: 'Get additional context about the file or project when needed for better resolution',
    inputSchema: z.object({
      contextType: z.enum(['file_type', 'framework', 'dependencies', 'coding_standards']).describe('Type of context needed'),
      question: z.string().describe('Specific question about the context')
    }),
    execute: async ({ contextType, question }) => {
      // This would typically fetch real context, but for now return a placeholder
      return {
        context: {
          type: contextType,
          question,
          answer: `Context for ${contextType}: ${question}`
        }
      }
    }
  })
}
