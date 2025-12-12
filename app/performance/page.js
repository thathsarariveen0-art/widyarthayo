'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Users, Plus, Trash2, AlertCircle, CheckCircle, X, TrendingUp, Loader2, Award, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Chart colors inspired by Instagram
const chartColors = [
  '#833AB4', // Purple
  '#FD1D1D', // Red
  '#FCAF45', // Orange
  '#000000', // Black
  '#4A4A4A', // Gray
  '#E1306C', // Pink
  '#405DE6', // Blue
]

export default function PerformancePage() {
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [chartType, setChartType] = useState('bar')
  
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    score: ''
  })

  // Fetch marks from Supabase
  const fetchMarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMarks(data || [])
    } catch (err) {
      console.error('Error fetching marks:', err)
      setError('Failed to load marks. Please check Supabase setup.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarks()
  }, [fetchMarks])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Please login to add marks.')
      return
    }
    
    if (!formData.name.trim() || !formData.score) {
      setError('Please fill in all fields.')
      return
    }

    const score = parseFloat(formData.score)
    if (isNaN(score) || score < 0 || score > 100) {
      setError('Score must be between 0 and 100.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('marks')
        .insert([{
          id: `mark_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: formData.name.trim(),
          score: score,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      setSuccess('Mark added successfully!')
      setFormData({ name: '', score: '' })
      fetchMarks()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Submit error:', err)
      setError(`Failed to add mark: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (mark) => {
    if (!isAuthenticated) {
      setError('Please login to delete marks.')
      return
    }

    if (!confirm(`Delete mark for "${mark.name}"?`)) return

    try {
      const { error } = await supabase
        .from('marks')
        .delete()
        .eq('id', mark.id)

      if (error) throw error

      setSuccess('Mark deleted successfully!')
      fetchMarks()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Delete error:', err)
      setError(`Delete failed: ${err.message}`)
    }
  }

  // Prepare chart data - aggregate by student name
  const getAggregatedData = () => {
    const aggregated = marks.reduce((acc, mark) => {
      if (!acc[mark.name]) {
        acc[mark.name] = { total: 0, count: 0 }
      }
      acc[mark.name].total += mark.score
      acc[mark.name].count += 1
      return acc
    }, {})

    const labels = Object.keys(aggregated)
    const averages = labels.map(name => 
      Math.round((aggregated[name].total / aggregated[name].count) * 10) / 10
    )

    return { labels, averages }
  }

  const { labels, averages } = getAggregatedData()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Score',
        data: averages,
        backgroundColor: labels.map((_, i) => chartColors[i % chartColors.length] + '80'),
        borderColor: labels.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 2,
        borderRadius: 8,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: labels.map((_, i) => chartColors[i % chartColors.length]),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#000',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `Score: ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12, weight: '500' }
        }
      }
    }
  }

  // Get top performers
  const getTopPerformers = () => {
    const sorted = [...Object.entries(getAggregatedData().labels.reduce((acc, name, i) => {
      acc[name] = averages[i]
      return acc
    }, {}))].sort((a, b) => b[1] - a[1])
    return sorted.slice(0, 3)
  }

  const topPerformers = getTopPerformers()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="ig-gradient-text">Performance Tracker</span>
            </h1>
            <p className="text-gray-500 text-lg">Track and compare marks with your friends</p>
          </div>

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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Mark Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Mark
                </h2>
                
                {authLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                  </div>
                ) : isAuthenticated ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                        placeholder="Enter score"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 ig-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      Add Mark
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">Please login to add marks</p>
                    <Link 
                      href="/login"
                      className="inline-flex items-center gap-2 px-5 py-2.5 ig-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
                    >
                      Login
                    </Link>
                  </div>
                )}

                {/* Top Performers */}
                {topPerformers.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" /> Top Performers
                    </h3>
                    <div className="space-y-3">
                      {topPerformers.map(([name, score], index) => (
                        <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{name}</div>
                            <div className="text-sm text-gray-500">Avg: {score}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart and Table */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Score Comparison
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        chartType === 'bar' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        chartType === 'line' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Line
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : marks.length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-3" />
                      <p>No data to display. Add some marks!</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-80">
                    {chartType === 'bar' ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <Line data={chartData} options={chartOptions} />
                    )}
                  </div>
                )}
              </div>

              {/* Marks Table */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" /> All Marks
                </h2>
                
                {loading ? (
                  <div className="text-center py-10">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                  </div>
                ) : marks.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3" />
                    <p>No marks recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Score</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                          {isAuthenticated && (
                            <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((mark, index) => (
                          <tr key={mark.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                                >
                                  {mark.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{mark.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                mark.score >= 80 ? 'bg-green-100 text-green-700' :
                                mark.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {mark.score}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {new Date(mark.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            {isAuthenticated && (
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDelete(mark)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
