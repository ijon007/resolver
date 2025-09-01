"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarMenuButton } from "../ui/sidebar"
import { Command } from "lucide-react"
import { NavUser } from "./nav-user"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function SiteHeader() {
  const pathname = usePathname()
  const [prTitle, setPrTitle] = useState<string | null>(null)
  
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    
    // Check if we're on a dashboard PR route (dashboard/[prId])
    if (segments[0] === 'dashboard' && segments.length > 1) {
      // Use the same mock data structure as the page
      const mockPrData = {
        title: "Add user authentication system",
        number: 42,
        fromBranch: "feature/auth",
        toBranch: "main",
        status: "open",
        hasConflicts: true,
        repo: "myorg/myapp",
        author: "john-doe",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T14:45:00Z",
        commits: 8,
        additions: 156,
        deletions: 23,
        conflicts: []
      }
      
      setPrTitle(mockPrData.title)
    } else {
      setPrTitle(null)
    }
  }, [pathname])
  
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Always start with home
    breadcrumbs.push({
      label: "Resolver",
      href: "/",
      isLast: segments.length === 0
    })
    
    if (segments.length === 0) {
      return breadcrumbs
    }
    
    // Dashboard
    if (segments[0] === 'dashboard') {
      
      // Dashboard PR page (dashboard/[prId])
      if (segments.length > 1) {
        const prId = segments.slice(1).join('/')
        const displayTitle = prTitle
        breadcrumbs.push({
          label: displayTitle,
          href: `/dashboard/${prId}`,
          isLast: true
        })
      }
    }
  
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b justify-between">
      <div className="flex h-(--header-height) w-full items-center justify-start gap-2 px-4">
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>
                      {index === 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <Command className="size-4" />
                          </div>
                          <span className="font-medium">{breadcrumb.label}</span>
                        </div>
                      ) : (
                        <span className="font-medium">{breadcrumb.label}</span>
                      )}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.href}>
                        {index === 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                              <Command className="size-4" />
                            </div>
                            <span className="font-medium">{breadcrumb.label}</span>
                          </div>
                        ) : (
                          <span className="font-medium">{breadcrumb.label}</span>
                        )}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <NavUser user={user} /> */}
    </header>
  )
}
