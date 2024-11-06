// src/app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'VesselIQ Chat',
  description: 'Smart vessel insights chatbot',
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
