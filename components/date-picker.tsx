import { classNames } from '@/lib/classnames'
import * as React from 'react'

export type DatePickerOwnProps = {
  label?: string
}

type DatePickerProps = DatePickerOwnProps &
  React.ComponentPropsWithoutRef<'input'>

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, id, name, type = 'date', className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id || name} className="block mb-2 font-semibold">
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          type={type}
          // defaultValue={new Date().toISOString().split('T')[0]}
          className={classNames(
            'block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring',
            className
          )}
        />
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
