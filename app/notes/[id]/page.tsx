import { getUserCookie } from '../../libs/action';
import { notFound } from 'next/navigation'
import Note from './note'


interface Note {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    courseId?: string
    courseName?: string
    tags: string[]
}

type NotePageProps = Promise<{ id: string }>


async function getNote(id: string): Promise<Note> {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // This is mock data - replace with actual API call
    const note = {
        id,
        title: 'Introduction to Neural Networks',
        content: `
# Introduction to React

React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible.

## Key Concepts

1. **Components**: The building blocks of React applications.
2. **JSX**: A syntax extension for JavaScript that looks similar to HTML.
3. **Props**: How you pass data to components.
4. **State**: How components manage and update their data.

## Example Code

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
  `,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: 'cs101',
        courseName: 'Introduction to Computer Science',
        tags: ['React', 'JavaScript', 'UI', 'UX']
    }

    // Simulate not found for specific ID
    if (id === 'not-found') {
        return notFound()
    }

    return note
}

export default async function NotePage(props: { params: NotePageProps }) {
    const userCookie = await getUserCookie();
    const { id } = await props.params;

    const user = userCookie ? {
        username: userCookie.username?.value || '',
        email: userCookie.email?.value || ''
    } : null;
    

    // console.log(params)
    const note = await getNote(id)
    return (
        <div className="min-h-screen bg-white">
            <Note note={note} user={user} />
        </div>
    )
}
