'use client'

import React from 'react'
import Header from '../../components/header'
import Sidebar from '../../components/sidebar'
import Recommendation from './recommendation'
import ReactMarkdown from 'react-markdown'

interface NoteProps {
  note: {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    courseId?: string
    courseName?: string
    tags: string[]
  }
  user: {
    username: string
    email: string
  } | null
}


const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-indigo-100 text-indigo-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
]

export default function Note({ note, user }: NoteProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const copyText = (text: string, event: React.MouseEvent<HTMLButtonElement>) => {
    copyToClipboard(text);
    const button = event?.target as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => {
      button.textContent = originalText;
    }, 3000);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{note.title}</h1>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 space-x-4">
                <time dateTime={note.createdAt}>
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </time>
                {note.courseName && (
                  <>
                    <span>•</span>
                    <span>Course: {note.courseName}</span>
                  </>
                )}
              </div>
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
                  pre: (props) => <pre className="bg-blue-50/50 rounded-md p-4 mb-4" {...props} />,
                  code: ({ inline, ...props }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) =>
                    inline ? (
                      <code className="rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm" {...props} />
                    ) : (
                      <div className="relative">
                        <div className="absolute -right-2 -top-2">
                          <button
                            onClick={(event) => { copyText(props.children as string, event) }}
                            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <code className="relative rounded bg-muted px-[1em] py-[0.9em] font-mono text-sm block overflow-x-auto" {...props} />
                      </div>
                    ),
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>

            <div className="my-8 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50 transition-colors">
                    Edit Note
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Share Note
                  </button>
                </div>
              </div>
            </div>

          <Recommendation noteId={note.id} />
          </div>
        </main>
      </div>
    </div>
  )
}
