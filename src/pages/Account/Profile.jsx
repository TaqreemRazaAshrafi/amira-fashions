import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ROUTES } from '../../constants/routes'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import Button from '../../components/common/Button'
import { TextField } from '../../components/common/Field'
import AccountLayout from '../../components/account/AccountLayout'

const profileSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().min(1, 'Enter your email.').email('That email does not look right.'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Enter a 10-digit mobile number.')
    .or(z.literal('')),
})

/** Profile details. Saves through the auth store, which owns the user record. */
export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const toast = useUIStore((state) => state.toast)
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  })

  const onSubmit = async (values) => {
    setFormError(null)
    try {
      await updateProfile({ ...values, phone: values.phone || null })
      toast({ title: 'Profile updated', variant: 'success' })
    } catch (error) {
      setFormError(error?.message ?? 'We could not save those changes. Please try again.')
    }
  }

  return (
    <AccountLayout
      title="Profile"
      description="Your Amira Fashions profile details."
      canonicalPath={ROUTES.accountProfile}
    >
      <h2 className="text-fluid-xl">Profile</h2>
      <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
        These details appear on your orders and receipts.
      </p>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex max-w-lg flex-col gap-7"
      >
        <TextField
          label="Full name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Mobile"
          type="tel"
          autoComplete="tel-national"
          inputMode="numeric"
          maxLength={10}
          hint="Used only for delivery updates"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {formError && (
          <p role="alert" className="text-fluid-sm text-danger">
            {formError}
          </p>
        )}

        <div>
          <Button
            type="submit"
            size="lg"
            magnetic={false}
            isLoading={isSubmitting}
            disabled={!isDirty}
          >
            Save changes
          </Button>
        </div>
      </form>
    </AccountLayout>
  )
}
