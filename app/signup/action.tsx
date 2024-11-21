'use server'

import { cookies } from 'next/headers'

export async function fetchUniversityList() {
  const response = await fetch('https://dash.note.lat/api/getAllUni', {
    method: 'GET'
  })
  const json = await response.json()
  return json.data
}

export async function handleSignup(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const universityName = formData.get('universityName') as string

  const response = await fetch('https://dash.note.lat/api/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_name: username,
      user_email: email,
      user_password: password,
      uni_name: universityName,
    }),
  })

  if (response.ok) {
    // We'll handle cookie setting in a separate server action
    const responseData = await response.json()
    return { success: responseData.success, user: responseData.user }
  } else if (response.status === 409) {
    return { success: false, error: 'User already exists' }
  } else {
    return { success: false, error: 'Signup failed' }
  }
}

export async function setUserCookie(username: string, email: string) {
  const cookieStore = await cookies()
  cookieStore.set('user', username)
  cookieStore.set('email', email)
}

export async function getUserCookie() {
  const cookieStore = await cookies()
  return {
    username: cookieStore.get('user'),
    email: cookieStore.get('email'),
  }
}