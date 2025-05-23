import React from 'react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 rounded-xl mx-auto mt-16 max-w-md p-8">
      <h1 className="text-5xl font-bold text-gray-400 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-4">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound
