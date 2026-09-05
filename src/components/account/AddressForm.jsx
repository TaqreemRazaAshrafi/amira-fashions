import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '../../utils/cn'
import Button from '../common/Button'
import { Checkbox, TextField } from '../common/Field'

/**
 * Delivery address validation.
 *
 * Exported because checkout validates the same shape — one schema means the
 * address saved from the account and the address typed at checkout can never
 * diverge in what they accept.
 */
export const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(2, 'Please enter the full name.'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number.'),
  line1: z.string().min(8, 'Please enter the full street address.'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Please enter the city.'),
  state: z.string().min(2, 'Please enter the state.'),
  pincode: z.string().regex(/^\d{6}$/, 'A pincode is six digits.'),
  isDefault: z.boolean().optional(),
})

export const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
}

/** Single-line rendering of a saved address, used in lists and summaries. */
export function formatAddress(address) {
  return [address.line1, address.line2, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ')
}

/**
 * Add or edit a delivery address.
 *
 * Controlled entirely by React Hook Form; the parent decides what `onSubmit`
 * does with the validated values (save to the address book, or carry into the
 * checkout flow).
 */
export function AddressForm({
  defaultValues = emptyAddress,
  onSubmit,
  onCancel,
  submitLabel = 'Save address',
  showDefaultToggle = true,
  className,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { ...emptyAddress, ...defaultValues },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Full name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Mobile"
          type="tel"
          required
          autoComplete="tel-national"
          inputMode="numeric"
          maxLength={10}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <TextField
        label="Address"
        required
        autoComplete="address-line1"
        placeholder="Flat, building, street"
        error={errors.line1?.message}
        {...register('line1')}
      />

      <TextField
        label="Landmark or area"
        autoComplete="address-line2"
        error={errors.line2?.message}
        {...register('line2')}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <TextField
          label="City"
          required
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <TextField
          label="State"
          required
          autoComplete="address-level1"
          error={errors.state?.message}
          {...register('state')}
        />
        <TextField
          label="Pincode"
          required
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={6}
          error={errors.pincode?.message}
          {...register('pincode')}
        />
      </div>

      <TextField
        label="Nickname"
        hint="Home, Work, Mum's — so you can tell them apart"
        error={errors.label?.message}
        {...register('label')}
      />

      {showDefaultToggle && (
        <Checkbox label="Use as my default delivery address" {...register('isDefault')} />
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" magnetic={false} isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="quiet" magnetic={false} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default AddressForm
