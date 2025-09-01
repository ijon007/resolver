import { ResolvePageClient } from "@/components/resolve/resolve-page-client"

interface ResolvePageProps {
  params: Promise<{ prId: string }>
}

export default async function ResolvePage({ params }: ResolvePageProps) {
  const { prId } = await params

  return <ResolvePageClient prId={prId} />
}
