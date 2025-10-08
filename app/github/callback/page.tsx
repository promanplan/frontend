'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const installation_id = searchParams.get('installation_id')
    const setup_action = searchParams.get('setup_action')
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    console.log('Callback params:', { installation_id, setup_action, code, error })
    
    if (installation_id && setup_action === 'install') {
      setStatus('success')
      setMessage(`GitHub App installed successfully! Installation ID: ${installation_id}`)
      
      // Store in localStorage for persistence
      localStorage.setItem('github_installation_id', installation_id)
      
      // Redirect to repos page after a short delay
      setTimeout(() => {
        router.push('/github/repos')
      }, 2000)
    } else if (installation_id) {
      setStatus('success')
      setMessage(`GitHub App connected successfully! Installation ID: ${installation_id}`)
      
      // Store in localStorage for persistence
      localStorage.setItem('github_installation_id', installation_id)
      
      // Redirect to repos page after a short delay
      setTimeout(() => {
        router.push('/github/repos')
      }, 2000)
    } else if (setup_action === 'install') {
      // This means user completed installation but we don't have installation_id yet
      setStatus('success')
      setMessage('Installation completed! Redirecting...')
      
      // Redirect to connect page to check for stored installation
      setTimeout(() => {
        router.push('/github/connect')
      }, 2000)
    } else if (error) {
      setStatus('error')
      setMessage(`Installation failed: ${error}`)
    } else {
      setStatus('error')
      setMessage('Installation was cancelled or no installation data received.')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Installation...
              </h2>
              <p className="text-gray-600">
                Please wait while we set up your GitHub integration.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Installation Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to select repositories...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Installation Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <button
                onClick={() => router.push('/github/connect')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
