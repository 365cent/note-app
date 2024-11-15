"use client";

import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Fieldset, Input, Label, Legend } from '@headlessui/react'



export default function SignForm() {
    const [query, setQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<{ domain: string; name: string } | null>(null);
    const [universities, setUniversities] = useState<{ domain: string; name: string }[]>([]);

    const filteredUniversities =
        query === ''
            ? universities
            : universities.filter((university) => {
                return university.name.toLowerCase().includes(query.toLowerCase())
            });

    const fetchUniversityList = async () => {
        const response = await fetch('https://dash.note.lat/api/getAllUni', {
            method: 'GET'
        });
        const json = await response.json();
        const { data } = json;
        console.log(data);
        setUniversities(data);
    };

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
                uni_name: selectedUniversity?.name,
            }),
        })
    }

    return (
        <form className="w-full max-w-lg mx-auto px-4" onSubmit={handleSignup}>
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
                        <Combobox value={selectedUniversity} onChange={(value) => setSelectedUniversity(value)}>
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full rounded-lg border-none bg-black/5 py-1.5 pr-8 pl-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                                    displayValue={(university: { name: string }) => university?.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search for your university"
                                    onFocus={fetchUniversityList}
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
                                        className="group flex cursor-default items-center gap-2 rounded-lg mx-1 py-1 px-2 select-none data-[focus]:bg-black/10 empty:bg-transparent"
                                    >
                                        <i className="invisible size-4 fill-white group-data-[selected]:visible ri-check-line"></i>
                                        <div className="text-sm/6 text-gray-900">{university.name}</div>
                                    </ComboboxOption>
                                ))}
                                {filteredUniversities.length === 0 && (
                                    <ComboboxOption
                                        key=""
                                        value=""
                                        className="group flex cursor-default items-center gap-2 rounded-lg mx-1 py-1 px-2 select-none data-[focus]:bg-black/10 empty:bg-transparent"
                                    >
                                        <i className="invisible size-4 fill-white group-data-[selected]:visible ri-check-line"></i>
                                        <div className="text-sm/6 text-gray-900">No university found</div>
                                    </ComboboxOption>
                                )}
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