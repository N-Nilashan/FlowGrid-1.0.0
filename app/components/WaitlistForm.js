// components/WaitlistForm.js
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export const WaitlistForm = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email,
            signup_date: new Date().toISOString()
          }
        ])

      if (supabaseError) throw supabaseError

      setSubmitted(true)
      setEmail('')
    } catch (err) {
      console.error('Error submitting to waitlist:', err)
      setError(err.message || 'Failed to join waitlist')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30 text-green-400">
        Thanks for joining! We'll be in touch soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (so we can stay close)"
          required
          className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={loading}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg ${
          loading ? 'opacity-70 cursor-not-allowed' : 'shadow-purple-500/20'
        }`}
      >
        {loading ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  )
}
