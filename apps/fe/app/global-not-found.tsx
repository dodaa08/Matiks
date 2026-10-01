// Import global styles and fonts
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider' 

const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}
 
export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
<div className='flex justify-center min-h-screen items-center'>
  <div className='flex flex-col text-3xl'>
        <h1>404 - Page Not Found 🫣</h1>
        {/* <p>This page does not exist.</p> */}
  </div>
</div>
        </ThemeProvider>
      </body>
    </html>
  )
}