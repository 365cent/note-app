'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
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
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-thin text-gray-800 dark:text-white">Note App</h2>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                pathname === item.href ? 'bg-gray-100 dark:bg-gray-700' : ''
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

