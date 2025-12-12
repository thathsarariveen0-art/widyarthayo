import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'විද්‍යාර්ථයෝ - Study Tracker',
  description: 'Track your questions and performance with the ultimate study companion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="si">
      <body className="bg-white text-black min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
