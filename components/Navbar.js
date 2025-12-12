'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Home, FileText, TrendingUp, User, LogOut, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_study-tracker-168/artifacts/lbuxugc4_photo_2025-12-11_11-56-34.jpg'

export default function Navbar() {
  const { user, profile, loading, signOut, isAuthenticated } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoggingOut(false)
      setShowDropdown(false)
    }
  }

  const isActive = (path) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xl font-bold ig-gradient-text">විද්‍යාර්ථයෝ</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`flex items-center gap-1 font-medium transition-colors ${
                isActive('/') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link 
              href="/questions" 
              className={`flex items-center gap-1 font-medium transition-colors ${
                isActive('/questions') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4" /> Question Band
            </Link>
            <Link 
              href="/performance" 
              className={`flex items-center gap-1 font-medium transition-colors ${
                isActive('/performance') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Performance
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 ig-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold">{profile?.full_name || 'User'}</div>
                    <div className="text-xs text-gray-500">{profile?.stream || 'Student'}</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold">{profile?.full_name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {profile?.stream}
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {loggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-black font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1 px-4 py-2 ig-gradient text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  )
}
