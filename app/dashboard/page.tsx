'use client'

import React, { useState } from 'react'
import Link from "next/link"
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import { getUser } from '../libs/action';

const icons = {
    courses: 'ri-book-line text-blue-500',
    notes: 'ri-booklet-line text-green-500',
    university: 'ri-school-line text-red-500',
    email: 'ri-mail-line text-purple-500'
}

interface User {
    username: string,
    email: string
}

interface Note {
    note_title: string,
    note_id: string,
    note_created_date: string,
    tag_name: string[],
    course_name: string,
    note_content: string
}

const InfoCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-semibold mt-1 text-gray-900">{value}</h3>
                </div>
                <div className="text-3xl"><i className={icon}></i></div>
            </div>
        </div>
    )
}

export default function NotePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [coursesCount, setCoursesCount] = useState<number>(0)
    const [noteCount, setNoteCount] = useState<number>(0)
    React.useEffect(() => {
        async function fetchUser() {
            const userData = await getUser();
            setUser(userData);
        }
        fetchUser();
    }, [])

    React.useEffect(() => {
        fetch('https://dash.note.lat/api/getAUserNotes?email=' + user?.email)
            .then((response) => response.json())
            .then((data: { data: Note[] }) => {
                console.log(data.data)
                const uniqueCourses = new Set(data.data.map(note => note.course_name));
                setCoursesCount(uniqueCourses.size);
                setNoteCount(data.data.length)
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }, [user])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Overview</h1>
                            <div className="flex gap-2">
                                <Link href="/notes">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        All Notes
                                    </button>
                                </Link>
                                <Link href="/create">
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <i className="ri-add-line mr-2"></i>
                                        New Note
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoCard title="Courses" value={coursesCount} icon={icons.courses} />
                            <InfoCard title="Notes" value={noteCount} icon={icons.notes} />
                            {/* <InfoCard title="Courses" value={userInfo?.coursesCount} icon={icons.courses} />
                            <InfoCard title="University" value={userInfo?.university} icon={icons.university} />
                            <InfoCard title="Email" value={userInfo?.email} icon={icons.email} /> */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

