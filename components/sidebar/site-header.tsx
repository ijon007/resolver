"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Command } from "lucide-react"
import { NavUser } from "./nav-user"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { mockPrData } from "@/constants/mockData"
import Image from "next/image"

export function SiteHeader() {
  const pathname = usePathname()
  const [prTitle, setPrTitle] = useState<string | null>(null)
  
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    
    // Check if we're on a dashboard PR route (dashboard/[prId])
    if (segments[0] === 'dashboard' && segments.length > 1) {
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
      href: "/dashboard",
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
    <header className="bg-background sticky top-0 z-50 flex items-center border-b justify-between">
      <div className="flex h-(--header-height) items-center justify-start gap-2 px-4">
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
                          <Image
                            src="/logo-no-bg.svg"
                            alt="Resolver"
                            width={20}
                            height={20}
                          />
                          <span className="font-medium text-foreground">{breadcrumb.label}</span>
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
                            <Image
                              src="/logo-no-bg.svg"
                              alt="Resolver"
                              width={20}
                              height={20}
                            />
                            <span className="font-medium text-foreground">{breadcrumb.label}</span>
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

      <div className="flex items-center gap-2 px-4">
        <ThemeSwitcher />
        <NavUser />
      </div>
    </header>
  )
}
