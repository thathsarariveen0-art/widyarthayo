'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, TrendingUp, Clock, Upload, Users, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_study-tracker-168/artifacts/lbuxugc4_photo_2025-12-11_11-56-34.jpg'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 ig-gradient rounded-full blur-xl opacity-30"></div>
                <img 
                  src={LOGO_URL} 
                  alt="විද්‍යාර්ථයෝ Logo" 
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to{' '}
              <span className="ig-gradient-text">විද්‍යාර්ථයෝ</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your ultimate study companion. Upload questions, track deadlines, and monitor your performance with ease.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/questions" 
                className="group inline-flex items-center gap-2 px-8 py-4 ig-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                <Upload className="w-5 h-5" />
                Question Band
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/performance" 
                className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                <TrendingUp className="w-5 h-5" />
                Performance
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why <span className="ig-gradient-text">විද්‍යාර්ථයෝ</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 ig-gradient rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Upload Questions</h3>
              <p className="text-gray-500 leading-relaxed">
                Upload your PDFs and track them with ease. View, download, and print anytime.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">7-Day Timer</h3>
              <p className="text-gray-500 leading-relaxed">
                Live countdown for each question. Know exactly when your time is up.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 ig-gradient rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Friends</h3>
              <p className="text-gray-500 leading-relaxed">
                Compare marks with friends and see who's leading with beautiful charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={LOGO_URL} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xl font-bold">විද්‍යාර්ථයෝ</span>
          </div>
          <p className="text-gray-400">
            &copy; 2025 විද්‍යාර්ථයෝ. Built with love for students.
          </p>
        </div>
      </footer>
    </div>
  )
}
