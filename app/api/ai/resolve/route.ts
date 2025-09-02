import { streamText, UIMessage, convertToModelMessages, smoothStream, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SYSTEM_PROMPT } from '@/lib/agent/system-prompt';
import { conflictResolutionTools } from '@/lib/agent/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response('Google API key not configured', { status: 500 });
    }

    const result = streamText({
        model: openai('gpt-4o'),
        system: SYSTEM_PROMPT,
        messages: [
            ...convertToModelMessages(messages)
        ],
        tools: conflictResolutionTools,
        stopWhen: stepCountIs(3),
        experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: 'word',
        }),
    });

    return result.toUIMessageStreamResponse();
}