'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Field, Fieldset, Input, Label, Button } from '@headlessui/react'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { handleLogin, setUserCookie, getUserCookie } from '../libs/action'



function DiaModal() {
    const searchParams = useSearchParams()
    const status = searchParams.get('status')
    const [isOpen, setIsOpen] = useState(true);

    if (status !== 'already' && status !== 'unauthorized') {
        return null
    }
    
    function close() {
        setIsOpen(false);
    }

    return (
        <Suspense fallback={null}>
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            {status === 'already' && (
                                <>
                                    <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                        User already exists
                                    </DialogTitle>
                                    <p className="mt-2 text-sm/6 text-gray-500">
                                        Please login with your credentials.
                                    </p>
                                </>
                            )}
                            {status === 'unauthorized' && (
                                <>
                                    <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                        User not logged in
                                    </DialogTitle>
                                    <p className="mt-2 text-sm/6 text-gray-500">
                                        Please login to continue.
                                    </p>
                                </>
                            )}
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-black/10 focus:outline-none data-[hover]:bg-gray-800 data-[focus]:outline-1 data-[focus]:outline-black data-[open]:bg-gray-900"
                                    onClick={close}
                                >
                                    Got it, thanks!
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Suspense>
    );
}

export default function LoginForm() {
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const onLoad = async () => {
            const user = await getUserCookie()
            if (user && user.username) {
                console.log('User already logged in')
                router.push('/dashboard')
            }
            else {
                console.log('User not logged in')
            }
        }
        onLoad()
    }, [router])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        console.log(formData)
        const result = await handleLogin(formData)

        if (result.success) {
            if (result.user) {
                await setUserCookie(result.user.user_name, result.user.user_email)
                router.push('/dashboard')
            }
        } else {
            setError(result.error || 'Login failed')
        }
    }

    return (
        <form className="w-full max-w-lg mx-auto px-4" onSubmit={onSubmit}>
            <Fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
                <h2 className="text-2xl font-semibold text-black">Login</h2>
                <Suspense fallback={null}>
                    <DiaModal />
                </Suspense>
                {error && <div className="text-red-500">{error}</div>}
                <Field>
                    <Label htmlFor="email" className="text-sm/6 font-medium text-black">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                    />
                </Field>
                <Field>
                    <Label htmlFor="password" className="text-sm/6 font-medium text-black">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                    />
                </Field>
                <button
                    type="submit"
                    className="mt-6 w-full rounded-lg bg-black py-2 px-3 text-sm font-semibold text-white hover:bg-black/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    Login
                </button>
            </Fieldset>
        </form>
    )
}