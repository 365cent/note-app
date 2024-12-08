'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
  { href: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { href: '/notes', icon: 'ri-book-line', label: 'All Notes' },
  { href: '/settings', icon: 'ri-settings-4-line', label: 'Settings' },
  { href: '/logout', icon: 'ri-logout-box-line', label: 'Logout' },
]

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <>
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link href="/" className="flex items-center gap-4 rounded-md -m-2 p-2 transition hover:bg-black/5 hover:cursor-pointer">
            <Image
              className="dark:invert"
              src="/assets/logo.png"
              alt="Note.lat logo"
              width={32}
              height={32}
              priority
            />
            <h1 className="text-xl font-semibold">Note.lat</h1>
          </Link>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <nav className="">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
            >
              {/* <span className="mr-3">{item.icon}</span> */}
              <i className={`${item.icon} mr-3`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

