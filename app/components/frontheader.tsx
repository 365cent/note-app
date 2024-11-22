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
        <header className="flex items-center justify-between row-start-1 w-full">
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
            <nav className="grid gap-2 grid-flow-col">
                {user && user.username ? (
                    <>
                        <Link href="/dashboard">
                            <Button className="inline-flex items-center gap-2 rounded-md border bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 transition focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                {user.username}
                            </Button>
                        </Link>
                        <Link href="/logout">
                            <Button className="inline-flex items-center gap-2 rounded-md border border-current bg-white py-1.5 px-3 text-sm/6 font-semibold text-gray-700 shadow-inner shadow-black/10 transition focus:outline-none data-[hover]:bg-gray-600 data-[hover]:text-white data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                Logout
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/signup">
                            <Button className="inline-flex items-center gap-2 rounded-md border bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 transition focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                Signup
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="inline-flex items-center gap-2 rounded-md border border-current bg-white py-1.5 px-3 text-sm/6 font-semibold text-gray-700 shadow-inner shadow-black/10 transition focus:outline-none data-[hover]:bg-gray-600 data-[hover]:text-white data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                Login
                            </Button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}