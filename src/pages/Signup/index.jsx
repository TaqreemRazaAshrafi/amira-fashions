import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ROUTES } from '../../constants/routes'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { Checkbox, PasswordField, TextField } from '../../components/common/Field'
import Redirect from '../../components/common/Redirect'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name.'),
    email: z.string().min(1, 'Enter your email.').email('That email does not look right.'),
    phone: z
      .string()
      .min(1, 'Enter your mobile number.')
      .regex(/^\d{10}$/, 'Enter a 10-digit mobile number, without the country code.'),
    password: z
      .string()
      .min(8, 'Passwords are at least 8 characters.')
      .regex(/[a-zA-Z]/, 'Include at least one letter.')
      .regex(/\d/, 'Include at least one number.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the terms to continue.' }),
    }),
  })
  // Attached to the confirmation field so the message appears where the fix is.
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Those passwords do not match.',
    path: ['confirmPassword'],
  })

/**
 * Create account.
 *
 * Validation runs client-side for immediacy, but the server is still the
 * authority: a rejected registration surfaces its message rather than being
 * swallowed. The password is sent once and never held in this component beyond
 * the submit.
 */
export default function SignupPage() {
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useUIStore((state) => state.toast)

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const registerUser = useAuthStore((state) => state.register)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const destination = location.state?.from ?? ROUTES.account

  if (isAuthenticated) return <Redirect to={destination} />

  const onSubmit = async (values) => {
    setFormError(null)
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      })
      toast({ title: 'Account created', description: 'Welcome to Amira.', variant: 'success' })
      navigate(destination, { replace: true })
    } catch (error) {
      setFormError(error?.message ?? 'We could not create your account. Please try again.')
    }
  }

  return (
    <>
      <Seo
        title="Create account"
        description="Create an Amira Fashions account to track orders, save pieces and check out faster."
        canonicalPath={ROUTES.signup}
        noIndex
      />

      <AuthLayout
        eyebrow="Your account"
        title="Create an account"
        description="Save your details, follow your orders and keep your wishlist across devices."
        footer={
          <>
            Already have an account?{' '}
            <AuthLink to={ROUTES.login} state={location.state}>
              Sign in
            </AuthLink>
          </>
        }
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-7">
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
            inputMode="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <TextField
            label="Mobile"
            type="tel"
            required
            autoComplete="tel-national"
            inputMode="numeric"
            maxLength={10}
            hint="10 digits, no country code"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <PasswordField
            label="Password"
            required
            autoComplete="new-password"
            hint="At least 8 characters, with a letter and a number"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordField
            label="Confirm password"
            required
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div>
            <Checkbox
              label="I agree to the Terms & Conditions and the Privacy Policy."
              {...register('terms')}
            />
            {errors.terms?.message && (
              <p role="alert" className="mt-2 text-fluid-xs text-danger">
                {errors.terms.message}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-fluid-sm text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth magnetic={false} isLoading={isSubmitting}>
            Create account
          </Button>
        </form>
      </AuthLayout>
    </>
  )
}
