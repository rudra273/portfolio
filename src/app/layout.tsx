// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CometAnimation from '@/components/CometAnimation'


const poppins = Poppins({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const roboto = Roboto({ 
  weight: '300',
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Rudrapratap Mohanty - Portfolio',
  description: 'Software Developer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} font-sans`}>
        <Background />
        <CometAnimation />
        <Navbar />
        <Sidebar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  )
}

