// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CometAnimation from '@/components/CometAnimation'
import JsonLd from '@/components/JsonLd'


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
  title: 'Rudrapratap Mohanty | Software Developer & MLOps Engineer',
  description: 'Portfolio of Rudrapratap Mohanty, a Software Developer specialized in Backend, MLOps, and DevOps Engineering. View projects and skills.',
  keywords: 'Software Developer, Backend Developer, MLOps Engineer, DevOps Engineer, Rudrapratap Mohanty',
  openGraph: {
    title: 'Rudrapratap Mohanty | Software Developer',
    description: 'Software Developer Portfolio showcasing projects in Backend, MLOps, and DevOps',
    url: 'https://your-domain.com',
    siteName: 'Rudrapratap Mohanty Portfolio',
    images: [
      {
        url: '/profile/rudra.jpg',
        width: 1200,
        height: 630,
        alt: 'Rudrapratap Mohanty',
      }
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="N3K_Su1-aKnUQGsKvImh-bsmeSeox79i4cuKihgibto" />
        <JsonLd />
      </head>
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

