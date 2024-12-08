'use client'

import React, { useState } from 'react'
import Link from "next/link"
import Sidebar from '../components/sidebar'
import Header from '../components/header'

interface User {
  username: string,
  email: string
}

interface HeaderProps {
  user: User | null
}

interface Note {
  note_title: string,
  note_id: string,
  note_created_date: string,
  tag_name: string[],
  course_name: string,
  note_content: string
}

export default function DashComponents({ user }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  React.useEffect(() => {
    fetch('https://dash.note.lat/api/getAUserNotes?email=' + user?.email)
      .then((response) => response.json())
      .then((data: { data: Note[] }) => {
        console.log(data)
        setNotes(data.data)
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  }, [user])

  const filteredNotes = query === ''
    ? notes
    : notes.filter((note) =>
        note.note_title.toLowerCase().includes(query.toLowerCase())
      )

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Your Notes</h1>
              <Link href="/create">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Note
                </button>
              </Link>
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Link href={`/notes/${note.note_id}`} key={note.note_id}>
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{note.note_title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {note.note_content.substring(0, 100)}...
                      </p>
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-semibold mr-2 mt-4">
                        {note.course_name}
                      </span>
                      {note.tag_name.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm font-semibold mr-2 mt-2">{tag}</span>
                      ))}
                    </div>
                    <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{note.note_created_date}</span>
                      <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

