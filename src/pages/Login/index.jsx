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

/** Accepts an email address or a 10-digit Indian mobile number. */
const identifierSchema = z
  .string()
  .min(1, 'Enter your email or mobile number.')
  .refine(
    (value) => /^\S+@\S+\.\S+$/.test(value) || /^\d{10}$/.test(value),
    'Enter a valid email address or a 10-digit mobile number.'
  )

const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(8, 'Passwords are at least 8 characters.'),
  remember: z.boolean().optional(),
})

/**
 * Sign in.
 *
 * Creating an account lives on its own route rather than behind a tab, so both
 * flows are linkable, indexable and can be returned to with the browser's back
 * button. Tokens are handled by the auth store; nothing sensitive is kept in
 * component state, and the password is never logged or echoed.
 */
export default function LoginPage() {
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useUIStore((state) => state.toast)

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', remember: true },
  })

  // Wherever the visitor was heading before being asked to sign in.
  const destination = location.state?.from ?? ROUTES.account

  if (isAuthenticated) return <Redirect to={destination} />

  const onSubmit = async (values) => {
    setFormError(null)
    try {
      const user = await login({ identifier: values.identifier, password: values.password })
      toast({ title: `Welcome back, ${user.name}`, variant: 'success' })
      navigate(destination, { replace: true })
    } catch (error) {
      setFormError(error?.message ?? 'We could not sign you in. Please try again.')
    }
  }

  return (
    <>
      <Seo
        title="Sign in"
        description="Sign in to your Amira Fashions account to track orders and keep your wishlist."
        canonicalPath={ROUTES.login}
        noIndex
      />

      <AuthLayout
        eyebrow="Your account"
        title="Welcome back"
        description="Sign in to track orders, revisit saved pieces and check out faster."
        footer={
          <>
            New to Amira?{' '}
            <AuthLink to={ROUTES.signup} state={location.state}>
              Create an account
            </AuthLink>
          </>
        }
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-7">
          <TextField
            label="Email or mobile"
            required
            autoComplete="username"
            inputMode="email"
            error={errors.identifier?.message}
            {...register('identifier')}
          />

          <PasswordField
            label="Password"
            required
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Checkbox label="Remember me" {...register('remember')} />
            <AuthLink to={ROUTES.forgotPassword}>Forgot password?</AuthLink>
          </div>

          {formError && (
            <p role="alert" className="text-fluid-sm text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth magnetic={false} isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-fluid-xs leading-relaxed text-muted">
          By continuing you agree to our terms and to receive order updates. We never share your
          details.
        </p>
      </AuthLayout>
    </>
  )
}
