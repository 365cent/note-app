'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '../libs/action';

interface User {
    username: string,
    email: string
}

interface HeaderProps {
    user: User | null
    toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function fetchUser() {
            const userData = await getUser();
            setUser(userData);
            if (!userData) {
                const timer = setTimeout(() => {
                    router.push('/login?status=unauthorized');
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
        fetchUser();
    }, [router]);


    return (
        <header className="flex items-center justify-between px-6 py-4 h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden">
                    <i className="ri-menu-line text-2xl"></i>
                </button>
                <span className="hidden sm:block">Lecture note has never been so easy</span>
                <Link href="/" className="rounded-md -m-2 p-2 transition hover:bg-black/5 hover:cursor-pointer">
                    <div className="flex items-center gap-2 md:hidden">
                        <Image
                            className="dark:invert"
                            src="/assets/logo.png"
                            alt="Note.lat logo"
                            width={32}
                            height={32}
                            priority
                        />
                        <h1 className="text-xl font-semibold">Note.lat</h1>
                    </div>
                </Link>
            </div>
            <nav className="flex items-center">
                {user ? (
                    <>
                        <Link href="/dashboard"><button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 max-w-32">
                            <span className="truncate">
                                {user.username.length < 3 ? `${user.username}'s Notebook` : user.username}
                            </span>
                        </button>
                        </Link>
                        <Link href="/logout">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Logout
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/signup">
                            <button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Signup
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Login
                            </button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}