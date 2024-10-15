// // src/app/layout.tsx
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import Background from '@/components/Background'
// import Navbar from '@/components/Navbar'
// import Sidebar from '@/components/Sidebar'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Rudrapratap Mohanty - Portfolio',
//   description: 'Software Developer Portfolio',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Background />
//         <Navbar />
//         <Sidebar />
//         <main className="min-h-screen"> 
//           {children}
//         </main>
        
//       </body>
//     </html>
//   )
// }

// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

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
        <Navbar />
        <Sidebar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  )
}