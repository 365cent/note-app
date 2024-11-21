'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@headlessui/react'

interface User {
    username: string,
    email: string
}

interface HeaderProps {
    user: User | null
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <Link href="/">
                <div className="flex items-center gap-4 rounded-md -m-2 p-2 transition hover:bg-black/5 hover:cursor-pointer">
                    <Image
                        className="dark:invert"
                        src="/assets/logo.png"
                        alt="Note.lat logo"
                        width={32}
                        height={32}
                        priority
                    />
                    <h1 className="text-xl font-semibold">Note.lat</h1>
                    <span className="hidden sm:block">Lecture note has never been so easy</span>
                </div>
            </Link>
            <nav className="flex items-center">
                {user ? (
                    <>
                        <Link href="/dashboard">
                            <Button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                {user.username}
                            </Button>
                        </Link>
                        <Link href="/logout">
                            <Button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Logout
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/signup">
                            <Button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Signup
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Login
                            </Button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}