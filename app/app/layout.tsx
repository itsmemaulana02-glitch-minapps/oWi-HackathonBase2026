import React from "react"
import { Sidebar } from '@/components/app/sidebar'
import { TopBar } from '@/components/app/top-bar'
import { DemoBanner } from '@/components/app/demo-banner'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DemoBanner />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
