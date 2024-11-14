"use client";

import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Fieldset, Input, Label, Legend } from '@headlessui/react'

const universities = [
    { domain: 'harvard.edu', name: 'Harvard University' },
    { domain: 'stanford.edu', name: 'Stanford University' },
    { domain: 'mit.edu', name: 'Massachusetts Institute of Technology' },
    { domain: 'berkeley.edu', name: 'University of California, Berkeley' },
    { domain: 'ox.ac.uk', name: 'University of Oxford' },
    { domain: 'cam.ac.uk', name: 'University of Cambridge' },
    { domain: 'caltech.edu', name: 'California Institute of Technology' },
    { domain: 'yale.edu', name: 'Yale University' },
    { domain: 'princeton.edu', name: 'Princeton University' },
    { domain: 'uchicago.edu', name: 'University of Chicago' },
    { domain: 'uwo.ca', name: 'Western University' },
]

export default function SignForm() {
    const [query, setQuery] = useState('')
    const [selectedUniversity, setSelectedUniversity] = useState(universities[0])

    const filteredUniversities =
        query === ''
            ? universities
            : universities.filter((university) => {
                return university.name.toLowerCase().includes(query.toLowerCase())
            })

    const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        fetch('https://dash.note.lat/api/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: event.currentTarget.username.value,
                user_email: event.currentTarget.email.value,
                user_password: event.currentTarget.password.value,
                uni_name: selectedUniversity,
            }),
        })
    }

    return (
        <form className="w-full max-w-lg px-4" onSubmit={handleSignup}>
            <Fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
                <Legend className="text-2xl font-semibold text-black">Signup</Legend>
                <Field>
                    <Label htmlFor="username" className="text-sm/6 font-medium text-black">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                    />
                </Field>
                <Field>
                    <Label htmlFor="email" className="text-sm/6 font-medium text-black">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                    />
                </Field>
                <Field>
                    <Label htmlFor="password" className="text-sm/6 font-medium text-black">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                    />
                </Field>
                <Field>
                    <Label htmlFor="university" className="text-sm/6 font-medium text-black">University</Label>
                    <div className="relative">
                        <Combobox value={selectedUniversity} onChange={(value) => setSelectedUniversity(value ?? universities[0])}>
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full rounded-lg border-none bg-black/5 py-1.5 pr-8 pl-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                                    displayValue={(university: { name: string }) => university?.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    {/* <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredUniversities.map((university) => (
                                    <ComboboxOption
                                        key={university.domain}
                                        value={university}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-black text-white' : 'text-gray-900'
                                            }`
                                        }
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={active ? 'font-semibold' : 'font-normal'}>
                                                    {university.name}
                                                </span>
                                                {selected && (
                                                    <span
                                                        className={`${active ? 'text-white' : 'text-black'
                                                            } absolute inset-y-0 left-0 flex items-center pl-3`}
                                                    >
                                                        <i className='ri-check-line'></i>
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </div>
                </Field>
                <button
                    type="submit"
                    className="mt-6 w-full rounded-lg bg-black py-2 px-3 text-sm font-semibold text-white hover:bg-black/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    Create account
                </button>
            </Fieldset>
        </form>
    )
}