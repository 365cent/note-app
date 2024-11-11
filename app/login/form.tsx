import { Description, Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'

export default function Example() {
  return (
    <div className="w-full max-w-lg px-4">
      <Fieldset className="space-y-6 rounded-xl bg-black/5 p-6 sm:p-10">
        <Legend className="text-2xl font-semibold text-black">Login</Legend>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Street address</Label>
          <Input
          className="mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            // className={clsx(
            //   'mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
            //   'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            // )}
          />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Country</Label>
          <Description className="text-sm/6 text-black/50">We currently only ship to North America.</Description>
          <div className="relative">
            <Select
            className="mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            //   className={clsx(
            //     'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
            //     'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
            //     // Make the text of each option black on Windows
            //     '*:text-black'
            //   )}
            >
              <option>Canada</option>
              <option>Mexico</option>
              <option>United States</option>
            </Select>
            {/* <ChevronDownIcon
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
              aria-hidden="true"
            /> */}
          </div>
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Delivery notes</Label>
          <Textarea
          className="mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            // className={clsx(
            //   'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
            //   'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            // )}
            rows={3}
          />
        </Field>
      </Fieldset>
    </div>
  )
}
