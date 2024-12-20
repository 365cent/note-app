'use client';

import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import
import { useEffect, useCallback } from 'react';
import { logout } from './logout';

export default function LogoutPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter(); // `useRouter` from `next/navigation`

    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            closeDialog();
            logout();
        }, 3000);

        return () => clearTimeout(timer);
    }, [closeDialog, router]);

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDialog}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                            User logged out
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-gray-500">
                            You have been logged out successfully.
                        </p>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-black/10 focus:outline-none data-[hover]:bg-gray-800 data-[focus]:outline-1 data-[focus]:outline-black data-[open]:bg-gray-900"
                                onClick={closeDialog}
                            >
                                Got it, thanks!
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}