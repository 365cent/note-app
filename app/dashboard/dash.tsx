'use client'

import * as React from 'react'
import Link from "next/link"
// import Image from "next/image"
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
    note_created_data: string,
    tag_name: string[]
}

export default function DashComponents({ user }: HeaderProps) {
    const [query, setQuery] = React.useState('')
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
    // send a request to the server to get the notes
    const [notes, setNotes] = React.useState<Note[]>([])

    React.useEffect(() => {
        fetch('https://dash.note.lat/api/getAUserNotes?email=' + user?.email)
            .then((response) => response.json())
            .then((data: { data: Note[] }) => {
                console.log(data)
                setNotes(data.data)
                // console.log(notes)
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }, []);

    const filteredNotes = query === ''
        ? notes
        : notes.filter((note) =>
            note.note_title.toLowerCase().includes(query.toLowerCase())
        )

    // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    // const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed)

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'w-16' : 'w-64'} fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* <div className="flex items-center justify-between h-20 border-b dark:border-gray-700 px-4">
          <button onClick={toggleSidebarCollapse} className="lg:hidden">
            <i className={`ri-${isSidebarCollapsed ? 'menu-unfold' : 'menu-fold'}-line text-gray-500`}></i>
          </button>
        </div> */}
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
                                <Link href={`/notes/${note.note_id}`} key={note.note_id}>
                                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{note.note_title}</h3>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                {/* {note.content.substring(0, 100)}... */}
                                                {/* {note.content} */}
                                                {note.tag_name.map((tag) => (
                                                    <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mt-2">{tag}</span>
                                                ))}
                                            </p>
                                        </div>
                                        <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">{note.note_created_data}</span>
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