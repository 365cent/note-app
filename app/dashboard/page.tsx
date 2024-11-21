'use client'

import * as React from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button, Combobox } from '@headlessui/react'

// Mock data for notes
const notes = [
  { id: 1, title: "Introduction to React", content: "React is a JavaScript library for building user interfaces...", date: "2024-03-15" },
  { id: 2, title: "Next.js Basics", content: "Next.js is a React framework that enables server-side rendering...", date: "2024-03-16" },
  { id: 3, title: "Tailwind CSS Tutorial", content: "Tailwind CSS is a utility-first CSS framework...", date: "2024-03-17" },
  { id: 4, title: "JavaScript ES6 Features", content: "ES6 introduced many new features to JavaScript...", date: "2024-03-18" },
  { id: 5, title: "TypeScript Fundamentals", content: "TypeScript is a typed superset of JavaScript...", date: "2024-03-19" },
  { id: 6, title: "Git Version Control", content: "Git is a distributed version control system...", date: "2024-03-20" },
]

export default function Dashboard() {
  const [query, setQuery] = React.useState('')
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  const filteredNotes = query === ''
    ? notes
    : notes.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase())
      )

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'w-16' : 'w-64'} fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 border-b dark:border-gray-700 px-4">
          <Link href="/">
            <div className="flex items-center">
              <Image
                className="dark:invert"
                src="/assets/logo.png"
                alt="Note.lat logo"
                width={32}
                height={32}
                priority
              />
              {!isSidebarCollapsed && <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Note.lat</span>}
            </div>
          </Link>
          <button onClick={toggleSidebarCollapse} className="lg:hidden">
            <i className={`ri-${isSidebarCollapsed ? 'menu-unfold' : 'menu-fold'}-line text-gray-500`}></i>
          </button>
        </div>
        <nav className="mt-5">
          <Link href="/dashboard" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <i className="ri-dashboard-line w-5 h-5 mr-3"></i>
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link href="/notes" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <i className="ri-book-2-line w-5 h-5 mr-3"></i>
            {!isSidebarCollapsed && <span>All Notes</span>}
          </Link>
          <Link href="/settings" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <i className="ri-settings-line w-5 h-5 mr-3"></i>
            {!isSidebarCollapsed && <span>Settings</span>}
          </Link>
          <Link href="/logout" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <i className="ri-logout-circle-line w-5 h-5 mr-3"></i>
            {!isSidebarCollapsed && <span>Logout</span>}
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
              <i className="ri-menu-line h-6 w-6"></i>
            </button>
          </div>
          <div className="flex items-center">
            <Button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Signup
            </Button>
            <Button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Your Notes</h1>
              <Link href="/create">
                <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <i className="ri-add-line h-5 w-5 mr-2"></i>
                  New Note
                </Button>
              </Link>
            </div>
            <div className="mb-6">
              <Combobox value={query} onChange={(value) => setQuery(value ?? '')}>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <Combobox.Input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search notes..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </Combobox>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Link href={`/notes/${note.id}`} key={note.id}>
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{note.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {note.content.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{note.date}</span>
                      <Button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i className="ri-more-line h-5 w-5"></i>
                      </Button>
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