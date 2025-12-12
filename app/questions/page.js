'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Upload, Eye, Download, Printer, Clock, AlertCircle, CheckCircle, Trash2, X, ZoomIn, ZoomOut, FileText, Loader2, Lock } from 'lucide-react'
import { supabase, PDF_BUCKET, getPublicUrl } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_study-tracker-168/artifacts/lbuxugc4_photo_2025-12-11_11-56-34.jpg'

// PDF Viewer Modal Component
const PDFViewerModal = ({ file, onClose }) => {
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))

  const handlePrint = () => {
    const printWindow = window.open(file.file_url, '_blank')
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print()
      })
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = file.file_url
    link.download = file.file_name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-lg truncate flex-1 mr-4">{file.file_name}</h3>
          <div className="flex items-center gap-2">
            <button onClick={handleZoomOut} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Zoom Out">
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Zoom In">
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button onClick={handleDownload} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={handlePrint} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Print">
              <Printer className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button onClick={onClose} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          )}
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
            <iframe 
              src={`${file.file_url}#toolbar=0`}
              className="w-full bg-white shadow-lg"
              style={{ height: '80vh', minWidth: '100%' }}
              onLoad={() => setLoading(false)}
              title={file.file_name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Countdown Timer Component
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({})
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiryDate).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setIsExpired(true)
        return {}
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold">Time is Over!</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Clock className="w-5 h-5 text-gray-500" />
      <div className="flex gap-2">
        <div className="bg-black text-white px-3 py-1 rounded-lg text-center min-w-[50px]">
          <div className="text-lg font-bold">{timeLeft.days || 0}</div>
          <div className="text-[10px] text-gray-400 uppercase">Days</div>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-lg text-center min-w-[50px]">
          <div className="text-lg font-bold">{timeLeft.hours || 0}</div>
          <div className="text-[10px] text-gray-400 uppercase">Hours</div>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-lg text-center min-w-[50px]">
          <div className="text-lg font-bold">{timeLeft.minutes || 0}</div>
          <div className="text-[10px] text-gray-400 uppercase">Min</div>
        </div>
        <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-center min-w-[50px]">
          <div className="text-lg font-bold">{timeLeft.seconds || 0}</div>
          <div className="text-[10px] text-gray-400 uppercase">Sec</div>
        </div>
      </div>
    </div>
  )
}

// PDF Card Component
const PDFCard = ({ file, onView, onDelete, canDelete }) => {
  const uploadDate = new Date(file.uploaded_at)
  const expiryDate = new Date(file.expiry_at)
  const isExpired = new Date() > expiryDate

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = file.file_url
    link.download = file.file_name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printWindow = window.open(file.file_url, '_blank')
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print()
      })
    }
  }

  return (
    <div className={`card-hover bg-white border rounded-2xl p-6 shadow-sm ${isExpired ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isExpired ? 'bg-red-100' : 'ig-gradient'}`}>
            <FileText className={`w-6 h-6 ${isExpired ? 'text-red-600' : 'text-white'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{file.file_name}</h3>
            <p className="text-sm text-gray-500">
              Uploaded: {uploadDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        {isExpired && (
          <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
            EXPIRED
          </span>
        )}
      </div>

      {/* Timer */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <div className="text-xs text-gray-500 mb-2">
          Expires: {expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <CountdownTimer expiryDate={file.expiry_at} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onView(file)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button 
          onClick={handleDownload}
          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" 
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button 
          onClick={handlePrint}
          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" 
          title="Print"
        >
          <Printer className="w-4 h-4" />
        </button>
        {canDelete && (
          <button 
            onClick={() => onDelete(file)}
            className="p-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors" 
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function QuestionsPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [viewingFile, setViewingFile] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const { isAuthenticated, loading: authLoading } = useAuth()

  // Fetch files from Supabase
  const fetchFiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error fetching files:', err)
      setError('Failed to load files. Please check Supabase setup.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Handle file upload
  const handleUpload = async (e) => {
    if (!isAuthenticated) {
      setError('Please login to upload files.')
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or image file.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(PDF_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const fileUrl = getPublicUrl(fileName)

      // Calculate expiry date (7 days from now)
      const uploadedAt = new Date()
      const expiryAt = new Date(uploadedAt.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('pdfs')
        .insert([{
          id: `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          file_name: file.name,
          file_path: fileName,
          file_url: fileUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_at: uploadedAt.toISOString(),
          expiry_at: expiryAt.toISOString()
        }])
        .select()
        .single()

      if (dbError) throw dbError

      setSuccess('File uploaded successfully!')
      fetchFiles()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  // Handle file delete
  const handleDelete = async (file) => {
    if (!isAuthenticated) {
      setError('Please login to delete files.')
      return
    }

    if (!confirm(`Delete "${file.file_name}"?`)) return

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(PDF_BUCKET)
        .remove([file.file_path])

      if (storageError) console.warn('Storage delete warning:', storageError)

      // Delete from database
      const { error: dbError } = await supabase
        .from('pdfs')
        .delete()
        .eq('id', file.id)

      if (dbError) throw dbError

      setSuccess('File deleted successfully!')
      fetchFiles()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Delete error:', err)
      setError(`Delete failed: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="ig-gradient-text">Question Band</span>
            </h1>
            <p className="text-gray-500 text-lg">Upload your PDFs and track the 7-day countdown</p>
          </div>

          {/* Upload Section */}
          {authLoading ? (
            <div className="mb-10 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : isAuthenticated ? (
            <div className="mb-10">
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-white">
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 ig-gradient rounded-2xl flex items-center justify-center">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {uploading ? 'Uploading...' : 'Upload PDF or Image'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Click to browse or drag and drop
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="mb-10 bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-gray-500 mb-4">Please login to upload files</p>
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 ig-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Login to Upload
              </Link>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          {/* Files Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No files uploaded yet</h3>
              <p className="text-gray-400">Upload your first PDF to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {files.map((file) => (
                <PDFCard 
                  key={file.id} 
                  file={file} 
                  onView={setViewingFile}
                  onDelete={handleDelete}
                  canDelete={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {viewingFile && (
        <PDFViewerModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  )
}
