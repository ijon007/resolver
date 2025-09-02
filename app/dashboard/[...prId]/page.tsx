import { ResolvePageClient } from "@/components/resolve/resolve-page-client"
import { fetchPR, fetchPRFiles } from "@/actions/github"

interface ResolvePageProps {
  params: Promise<{ prId: string[] }>
}

export default async function ResolvePage({ params }: ResolvePageProps) {
  const { prId } = await params
  const prIdString = prId.join('/')

  try {
    const [pr, files] = await Promise.all([
      fetchPR(prIdString),
      fetchPRFiles(prIdString)
    ])

    return <ResolvePageClient prId={prIdString} pr={pr} files={files} />
  } catch (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load PR'}
          </p>
        </div>
      </div>
    )
  }
}
