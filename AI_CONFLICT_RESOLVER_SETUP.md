# AI Conflict Resolver Setup Guide

This document explains how to set up the AI-powered merge conflict resolver with GitHub Actions.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# GitHub App Configuration
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY=your_github_app_private_key
GITHUB_APP_WEBHOOK_SECRET=your_github_app_webhook_secret

# AI API Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
AI_API_URL=https://your-domain.com
AI_API_KEY=your_ai_api_key

# Database Configuration
DATABASE_URL=your_database_url

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## GitHub App Setup

1. Create a GitHub App with the following permissions:
   - **Contents**: Read & Write
   - **Pull requests**: Read & Write
   - **Actions**: Read & Write
   - **Metadata**: Read

2. Generate a private key and download it

3. Install the GitHub App on your repositories

## GitHub Actions Secrets

Add these secrets to your repository:

1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `AI_API_URL`: Your deployed API URL
   - `AI_API_KEY`: A secure API key for your AI service

## Workflow

### Step 1: User Triggers Resolution
- User enters PR link in the web UI
- System detects conflicts and shows "Start AI Resolution" button
- User clicks button to trigger GitHub Actions workflow

### Step 2: GitHub Actions Detects Conflicts
- Workflow checks out PR branch
- Attempts merge with base branch (`git merge --no-commit --no-ff`)
- Git automatically inserts conflict markers in conflicted files
- Workflow extracts conflicted files and sends to AI API

### Step 3: AI Resolves Conflicts
- AI API receives conflicted files
- AI removes conflict markers and merges changes intelligently
- AI returns resolved files with explanations and confidence scores

### Step 4: User Reviews and Approves
- GitHub Actions uploads resolved files as artifacts
- Web UI fetches artifacts and displays AI suggestions
- User can review each file's resolution and explanation
- User clicks "Accept All" to commit resolutions

### Step 5: Commit Resolutions
- System commits all approved resolutions to PR branch
- PR becomes conflict-free and ready to merge

## Features

- **Real Git Merge Detection**: Uses actual Git merges to detect conflicts accurately
- **AI-Powered Resolution**: Leverages AI to intelligently resolve conflicts
- **UI Review Process**: Human oversight before committing changes
- **Batch Processing**: Handles multiple files efficiently
- **Confidence Scoring**: AI provides confidence levels for each resolution
- **Artifact Management**: Uses GitHub Actions artifacts for data transfer

## Architecture

```
User UI → GitHub Actions → AI API → Artifacts → User Review → Commit
```

## Troubleshooting

### Common Issues

1. **Workflow not triggering**: Check GitHub App permissions and repository access
2. **AI API errors**: Verify API keys and endpoint configuration
3. **Artifact download fails**: Ensure proper authentication and artifact availability
4. **Commit failures**: Check branch permissions and file paths

### Debug Steps

1. Check GitHub Actions logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test AI API endpoint independently
4. Check repository permissions and branch protection rules

## Security Considerations

- GitHub App uses minimal required permissions
- AI API requires authentication
- All file operations are logged and auditable
- User must explicitly approve all changes before committing
