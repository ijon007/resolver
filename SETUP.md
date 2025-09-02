# AI Conflict Resolution Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# AI Provider Configuration
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_PROVIDER=openai

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_database_url_here
```

## How It Works

1. **User Flow**: User sees PR with conflicts → clicks "AI Resolve" button → AI analyzes and resolves conflicts → shows resolved content with explanation and confidence score

2. **Architecture**:
   - `FileContent.tsx` - UI component with resolve button
   - `actions/ai-resolve.ts` - Server action that calls AI with tools
   - `lib/agent/tools.ts` - AI tools for conflict analysis and resolution
   - `lib/agent/system-prompt.ts` - System prompt for the AI
   - `actions/github-resolve.ts` - Applies resolved content to GitHub

3. **AI Tools**:
   - `analyzeConflict` - Analyzes conflict type and complexity
   - `resolveConflict` - Provides final resolved content
   - `validateResolution` - Validates the quality of resolution
   - `getContext` - Gets additional context when needed

## Usage

1. Set up your environment variables
2. Run the development server: `npm run dev`
3. Sign in with GitHub
4. Navigate to a PR with conflicts
5. Click "AI Resolve" button to resolve conflicts
6. Review the AI's resolution and apply to GitHub if satisfied
