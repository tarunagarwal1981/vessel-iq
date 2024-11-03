import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VesselIQ',
  description: 'Smart vessel performance analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
