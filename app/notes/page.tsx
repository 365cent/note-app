'use client'

import * as React from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button } from '@headlessui/react'
import ReactMarkdown from 'react-markdown'

// Mock data for a single note
const note = {
    id: 1,
    title: "Introduction to React",
    content: `
# Introduction to React

React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible.

## Key Concepts

1. **Components**: The building blocks of React applications.
2. **JSX**: A syntax extension for JavaScript that looks similar to HTML.
3. **Props**: How you pass data to components.
4. **State**: How components manage and update their data.

## Example Code

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
  `,
    date: "2024-03-15",
    tags: ["React", "JavaScript", "Frontend", "Web Development"]
}

// Mock data for recommendations
const recommendations = [
    { id: 2, title: "Next.js Basics", snippet: "Next.js is a React framework that enables server-side rendering..." },
    { id: 3, title: "Tailwind CSS Tutorial", snippet: "Tailwind CSS is a utility-first CSS framework..." },
    { id: 4, title: "JavaScript ES6 Features", snippet: "ES6 introduced many new features to JavaScript..." },
]

const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
]

export default function NoteDetails() {
    // const params = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

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
                    <a className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
                        <i className="ri-book-2-line w-5 h-5 mr-3"></i>
                        {!isSidebarCollapsed && <span>All Notes</span>}
                    </a>
                    <Link href="/settings" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i className="ri-settings-line w-5 h-5 mr-3"></i>
                        {!isSidebarCollapsed && <span>Settings</span>}
                    </Link>
                    <a className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
                        <i className="ri-logout-circle-line w-5 h-5 mr-3"></i>
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </a>
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
                        <div className="mb-6">
                            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{note.title}</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{note.date}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {note.tags.map((tag, index) => (
                                    <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[index % tagColors.length]}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                            <ReactMarkdown
                                className="prose dark:prose-invert max-w-none"
                                components={{
                                    h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                                    h2: (props) => <h2 className="text-2xl font-semibold mb-3 mt-6" {...props} />,
                                    h3: (props) => <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />,
                                    p: (props) => <p className="mb-4" {...props} />,
                                    ul: (props) => <ul className="list-disc pl-5 mb-4" {...props} />,
                                    ol: (props) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                                    li: (props) => <li className="mb-1" {...props} />,
                                    code: ({ inline, ...props }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) =>
                                        inline ? (
                                            <code
                                                className="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5"
                                                {...props}
                                            />
                                        ) : (
                                            <code
                                                className="block bg-gray-100 dark:bg-gray-700 rounded p-2 mb-4"
                                                {...props}
                                            />
                                        ),
                                }}
                            >
                                {note.content}
                            </ReactMarkdown>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recommended Notes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.map((rec) => (
                                    <Link href={`/notes/${rec.id}`} key={rec.id}>
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{rec.title}</h3>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                    {rec.snippet}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}