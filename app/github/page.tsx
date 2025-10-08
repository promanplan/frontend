import Link from "next/link"

export default function GithubIndexPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="mb-4 text-2xl font-semibold">GitHub Integration</h1>
      <p className="mb-6 text-sm text-neutral-500">Choose an action:</p>
      <ul className="list-disc space-y-2 pl-6 text-sm">
        <li><Link className="text-blue-600 underline" href="/github/connect">Connect GitHub</Link></li>
        <li><Link className="text-blue-600 underline" href="/github/repos">Select repository</Link></li>
      </ul>
    </div>
  )
}


