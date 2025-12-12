'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'
import { User, Mail, GraduationCap, Calendar, ArrowLeft, Loader2, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="ig-gradient p-8 text-center text-white">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-gray-800 mb-4">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-white/80 mt-1">{user?.email}</p>
            </div>

            {/* Details */}
            <div className="p-8 space-y-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Profile Information
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-semibold">{profile?.full_name || 'Not set'}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-semibold">{user?.email || 'Not set'}</div>
                  </div>
                </div>

                {/* Stream */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Stream</div>
                    <div className="font-semibold flex items-center gap-2">
                      {profile?.stream === 'Biology' ? '🧬' : '📝'} {profile?.stream || 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-semibold">
                      {profile?.created_at 
                        ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Unknown'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-700">Account Active</div>
                  <div className="text-sm text-green-600">Your account is verified and active.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
