'use server'

import { delUserCookie } from '../libs/action'
import { redirect } from 'next/navigation'

export async function logout() {
    delUserCookie()
    redirect('/login')
}