'use client'

import * as React from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button, Switch, Combobox, Listbox, ListboxOptions, ListboxOption, Label, ListboxButton } from '@headlessui/react'

const classes = [
  { id: 1, name: 'Introduction to Computer Science' },
  { id: 2, name: 'Data Structures and Algorithms' },
  { id: 3, name: 'Web Development' },
  { id: 4, name: 'Database Systems' },
  { id: 5, name: 'Artificial Intelligence' },
  { id: 6, name: 'Machine Learning' },
  { id: 7, name: 'Computer Networks' },
  { id: 8, name: 'Operating Systems' },
]

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(false)
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [autoSave, setAutoSave] = React.useState(true)
  const [university, setUniversity] = React.useState('')
  const [major, setMajor] = React.useState('')
  const [selectedClasses, setSelectedClasses] = React.useState<{ id: number; name: string }[]>([])
  const [query, setQuery] = React.useState('')

  const filteredClasses =
    query === ''
      ? classes
      : classes.filter((classItem) =>
          classItem.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

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
          <Link href="/notes" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <i className="ri-book-2-line w-5 h-5 mr-3"></i>
            {!isSidebarCollapsed && <span>All Notes</span>}
          </Link>
          <Link href="/settings" className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-200 dark:bg-gray-700">
            <i className="ri-settings-3-line w-5 h-5 mr-3"></i>
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
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white ml-4">Settings</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">General Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
                  <Switch
                    checked={darkMode}
                    onChange={setDarkMode}
                    className={`${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Email Notifications</span>
                  <Switch
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                    className={`${
                      emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Auto-save Notes</span>
                  <Switch
                    checked={autoSave}
                    onChange={setAutoSave}
                    className={`${
                      autoSave ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        autoSave ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Academic Information</h2>
              <form className="space-y-4">
                <div>
                  <Listbox value={university} onChange={setUniversity}>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">University Name</Label>
                    <div className="relative mt-1">
                      <ListboxButton className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                        <span className="block truncate">{university || 'Select your university'}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <i className="ri-arrow-down-s-line h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {['University A', 'University B', 'University C'].map((uni) => (
                          <ListboxOption
                            key={uni}
                            className={({ focus }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                focus ? 'bg-blue-100 text-blue-900' : 'text-gray-900 dark:text-white'
                              }`
                            }
                            value={uni}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {uni}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <i className="ri-check-line h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
                <div>
                  <Listbox value={major} onChange={setMajor}>
                    <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Major</Listbox.Label>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                        <span className="block truncate">{major || 'Select your major'}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <i className="ri-arrow-down-s-line h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {['Computer Science', 'Engineering', 'Business', 'Arts'].map((maj) => (
                          <Listbox.Option
                            key={maj}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900 dark:text-white'
                              }`
                            }
                            value={maj}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {maj}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <i className="ri-check-line h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
                <div>
                  <label htmlFor="classes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Classes</label>
                  <Combobox value={selectedClasses} onChange={setSelectedClasses} multiple>
                    <div className="relative mt-1">
                      <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                          className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-white focus:ring-0"
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={() =>
                            selectedClasses.map((classItem: { id: number; name: string }) => classItem.name).join(', ')
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <i className="ri-arrow-down-s-line h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                      </div>
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredClasses.length === 0 && query !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                            Nothing found.
                          </div>
                        ) : (
                          filteredClasses.map((classItem) => (
                            <Combobox.Option
                              key={classItem.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white'
                                }`
                              }
                              value={classItem}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {classItem.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-blue-600'
                                      }`}
                                    >
                                      <i className="ri-check-line h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClasses.map((classItem) => (
                    <span
                      key={classItem.id}
                      className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {classItem.name}
                      <button
                        type="button"
                        onClick={() => setSelectedClasses(selectedClasses.filter((c) => c.id !== classItem.id))}
                        className="ml-1 focus:outline-none"
                      >
                        <i className="ri-close-line" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              </form>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Account Settings</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}