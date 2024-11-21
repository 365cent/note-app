'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { fetchUniversityList, handleSignup, setUserCookie, getUserCookie } from './action'

interface University {
    domain: string
    name: string
}

export default function SignupForm() {
    const [query, setQuery] = useState('')
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
    const [universities, setUniversities] = useState<University[]>([])
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()


    useEffect(() => {
        const onLoad = async () => {
            const user = await getUserCookie()
            if (user.username) {
                console.log('User already logged in')
                router.push('/dashboard')
            }
            else {
                console.log('User not logged in')
            }
        }
        onLoad()
    }, [])

    const filteredUniversities =
        query === ''
            ? universities
            : universities.filter((university) => {
                return university.name.toLowerCase().includes(query.toLowerCase())
            })

    const fetchUniversities = async () => {
        const data = await fetchUniversityList()
        setUniversities(data)
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const result = await handleSignup(formData)

        if (result.success) {
            if (result.user) {
                await setUserCookie(result.user.user_name, result.user.user_email)
                router.push('/dashboard')
            }
        } else {
            setError(result.error || 'Signup failed')
            if (result.error === 'User already exists') {
                router.push('/login?status=already')
            }
        }
    }

    return (
        <form className="w-full max-w-lg mx-auto px-4" onSubmit={onSubmit}>
            <fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
                <h2 className="text-2xl font-semibold text-black">Signup</h2>
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    <label htmlFor="username" className="text-sm/6 font-medium text-black">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm/6 font-medium text-black">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm/6 font-medium text-black">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
                    />
                </div>
                <div>
                    <label htmlFor="university" className="text-sm/6 font-medium text-black">University</label>
                    <div className="relative">
                        <Combobox value={selectedUniversity} onChange={setSelectedUniversity}>
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full rounded-lg border-none bg-black/5 py-1.5 pr-8 pl-3 text-sm/6 text-black focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
                                    displayValue={(university: University) => university?.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search for your university"
                                    onFocus={fetchUniversities}
                                />
                                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredUniversities.map((university) => (
                                    <ComboboxOption
                                        key={university.domain}
                                        value={university}
                                        className="group flex cursor-default items-center gap-2 rounded-lg mx-1 py-1 px-2 select-none data-[headlessui-state-active]:bg-black/10 empty:bg-transparent"
                                    >
                                        <i className="invisible size-4 fill-white group-data-[headlessui-state-selected]:visible ri-check-line"></i>
                                        <div className="text-sm/6 text-gray-900">{university.name}</div>
                                    </ComboboxOption>
                                ))}
                                {filteredUniversities.length === 0 && (
                                    <ComboboxOption
                                        value=""
                                        className="group flex cursor-default items-center gap-2 rounded-lg mx-1 py-1 px-2 select-none data-[headlessui-state-active]:bg-black/10 empty:bg-transparent"
                                    >
                                        <i className="invisible size-4 fill-white group-data-[headlessui-state-selected]:visible ri-check-line"></i>
                                        <div className="text-sm/6 text-gray-900">No university found</div>
                                    </ComboboxOption>
                                )}
                            </ComboboxOptions>
                        </Combobox>
                    </div>
                    <input type="hidden" name="universityName" value={selectedUniversity?.name || ''} />
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full rounded-lg bg-black py-2 px-3 text-sm font-semibold text-white hover:bg-black/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    Create account
                </button>
            </fieldset>
        </form>
    )
}

