'use client'

import React, { useState } from 'react'
import Link from "next/link"
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import { getUser } from '../libs/action';

const icons = {
    courses: 'ri-book-line text-blue-500',
    notes: 'ri-booklet-line text-green-500',
    university: 'ri-school-line text-purple-500',
    email: 'ri-mail-line text-yellow-500',
    course: 'ri-sticky-note-line text-blue-500'
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
            <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-between h-full">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className={`font-semibold mt-1 text-gray-900 ${String(value).length > 10 ? 'text-md' : 'text-2xl'}`}>{value}</h3>
                </div>
                <div className="text-3xl"><i className={icon}></i></div>
            </div>
        </div>
    )
}

export default function NotePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [noteCount, setNoteCount] = useState<number>(0)
    const [userInfo, setUserInfo] = useState<{ username: string, email: string, university: string, course_ids: string[] } | null>(null)
    const [courses, setCourses] = React.useState<{ [key: string]: { name: string, noteCount: number } }>({});


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
                setNoteCount(data.data.length)
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }, [user])

    React.useEffect(() => {
        if (!user?.email) return;

        fetch('https://dash.note.lat/api/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.user)
                    setUserInfo({
                        username: data.user.user_name,
                        email: data.user.user_email,
                        university: data.user.university_name,
                        course_ids: data.user.course_ids
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }, [user]);

    React.useEffect(() => {
        if (!userInfo?.course_ids || userInfo.course_ids.length === 0) return;

        userInfo.course_ids.forEach(courseId => {
            fetch(`https://dash.note.lat/api/getCourseNotes?course_id=${courseId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setCourses(prev => ({
                            ...prev,
                            [courseId]: {
                                name: data.data[0]?.course_name || 'Unknown Course',
                                noteCount: data.data.length
                            }
                        }));
                    }
                })
                .catch(error => {
                    console.error(`Error fetching course details for ${courseId}:`, error);
                });
        });
    }, [userInfo?.course_ids]);

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
                            <InfoCard title="Courses" value={userInfo?.course_ids.length || 0} icon={icons.courses} />
                            <InfoCard title="Notes" value={noteCount} icon={icons.notes} />
                            <InfoCard title="University" value={userInfo?.university || 'Not set'} icon={icons.university} />
                            <InfoCard title="Email" value={userInfo?.email || 'Not set'} icon={icons.email} />
                        </div>
                        <hr className="my-8" />
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(courses).map(([courseId, course]) => (
                                <InfoCard key={courseId} title={course.name} value={course.noteCount} icon={icons.course} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

