"use client";

import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Fieldset, Input, Label, Legend } from '@headlessui/react'

const universities = [
  { id: 1, name: 'Harvard University', domain: 'harvard.edu' },
  { id: 2, name: 'Stanford University', domain: 'stanford.edu' },
  { id: 3, name: 'Massachusetts Institute of Technology', domain: 'mit.edu' },
  { id: 4, name: 'University of California, Berkeley', domain: 'berkeley.edu' },
  { id: 5, name: 'University of Oxford', domain: 'ox.ac.uk' },
  { id: 6, name: 'University of Cambridge', domain: 'cam.ac.uk' },
  { id: 7, name: 'California Institute of Technology', domain: 'caltech.edu' },
  { id: 8, name: 'Yale University', domain: 'yale.edu' },
  { id: 9, name: 'Princeton University', domain: 'princeton.edu' },
  { id: 10, name: 'University of Chicago', domain: 'uchicago.edu' },
]

export default function LoginForm() {
  const [query, setQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0])

  const filteredUniversities =
    query === ''
      ? universities
      : universities.filter((university) => {
          return university.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="w-full max-w-lg px-4">
      <Fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
        <Legend className="text-2xl font-semibold text-black">Login</Legend>
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
                    key={university.id}
                    value={university}
                    // className={({ active }) =>
                    //   cn(
                    //     'relative cursor-default select-none py-2 pl-3 pr-9',
                    //     active ? 'bg-black text-white' : 'text-gray-900'
                    //   )
                    // }
                    className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-black text-white' : 'text-gray-900'
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
                            className={`${
                                active ? 'text-white' : 'text-black'
                                } absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
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
          Login
        </button>
      </Fieldset>
    </div>
  )
}