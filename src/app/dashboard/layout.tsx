import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
     
          <AppSidebar />
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

