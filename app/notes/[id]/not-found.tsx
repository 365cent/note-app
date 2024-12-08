import Link from 'next/link'

export default function NoteNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl text-gray-600 mb-4">Note not found</h2>
        <p className="text-gray-500 mb-6">
          The note you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/notes"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Notes
        </Link>
      </div>
    </div>
  )
}

