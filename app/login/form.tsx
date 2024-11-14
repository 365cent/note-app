import { Field, Fieldset, Input, Label, Legend } from '@headlessui/react'

export default function LoginForm() {

  return (
    <form className="w-full max-w-lg mx-auto px-4">
      <Fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
        <Legend className="text-2xl font-semibold text-black">Login</Legend>
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