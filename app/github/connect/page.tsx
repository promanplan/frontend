"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"

export default function ConnectPage() {
	const router = useRouter()
	const [isConnected, setIsConnected] = useState(false)
	const [installationId, setInstallationId] = useState<string | null>(null)
	const [installUrl, setInstallUrl] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Fetch install URL from API
		const fetchInstallUrl = async () => {
			try {
				const response = await fetch('/api/github/install-url')
				const data = await response.json()
				if (data.success) {
					setInstallUrl(data.installUrl)
				}
			} catch (error) {
				console.error('Failed to fetch install URL:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchInstallUrl()

		// Check if user is returning from GitHub installation
		const params = new URLSearchParams(window.location.search)
		const installation_id = params.get('installation_id')
		
		console.log('Connect page loaded, checking for installation_id:', installation_id)
		
		if (installation_id) {
			setInstallationId(installation_id)
			setIsConnected(true)
			// Store in localStorage for persistence
			localStorage.setItem('github_installation_id', installation_id)
			// Clean up URL and redirect to repos page
			window.history.replaceState({}, '', '/github/connect')
			router.push('/github/repos')
		} else {
			// Check if there's a stored installation ID in localStorage
			const storedInstallationId = localStorage.getItem('github_installation_id')
			if (storedInstallationId) {
				setInstallationId(storedInstallationId)
				setIsConnected(true)
				// Redirect to repos page if already connected
				router.push('/github/repos')
			}
		}
	}, [router])

	const handleConnect = () => {
		console.log('Initiating GitHub connection...')
	}

	if (isConnected) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center px-4">
				<div className="w-full max-w-md rounded-lg border border-neutral-200 p-8 shadow-sm dark:border-neutral-800">
					<div className="text-center">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<h1 className="mb-2 text-xl font-semibold">GitHub Connected!</h1>
						<p className="mb-6 text-sm text-neutral-500">
							Redirecting to repository selection...
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4">
			<div className="w-full max-w-md rounded-lg border border-neutral-200 p-8 shadow-sm dark:border-neutral-800">
				<div className="text-center">
					<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-neutral-800">
						<svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
						</svg>
					</div>
					<h1 className="mb-2 text-xl font-semibold">Connect GitHub</h1>
					<p className="mb-6 text-sm text-neutral-500">
						Install the GitHub App to grant repository access for deployments.
					</p>
				</div>
				{loading ? (
					<Button className="w-full" disabled>
						Loading...
					</Button>
				) : installUrl ? (
					<Link href={installUrl}>
						<Button className="w-full" onClick={handleConnect}>Connect GitHub</Button>
					</Link>
				) : (
					<div className="text-sm text-red-500">
						Failed to load GitHub app configuration.
					</div>
				)}
				<div className="mt-6 text-xs text-neutral-500">
					<p>By connecting, you allow the app to:</p>
					<ul className="mt-2 space-y-1">
						<li>• Access your repository metadata</li>
						<li>• Read repository contents</li>
						<li>• Create deployments</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
