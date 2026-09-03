import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ROUTES } from '../../constants/routes'
import { cn } from '../../utils/cn'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Image from '../../components/common/Image'
import { Checkbox, TextField } from '../../components/common/Field'
import Redirect from '../../components/common/Redirect'
import { photo } from '../../utils/images'

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email.').email('That email does not look right.'),
  password: z.string().min(8, 'Passwords are at least 8 characters.'),
})

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Please enter your name.'),
})

const COVER = photo('1509319117193-57bab727e09d')

/**
 * Sign in / create account.
 *
 * One form, two schemas — the tab swaps the resolver and the submit handler
 * rather than duplicating the markup. Tokens are handled by the auth store;
 * nothing sensitive is kept in component state.
 */
export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const login = useAuthStore((state) => state.login)
  const registerUser = useAuthStore((state) => state.register)

  const isRegister = mode === 'register'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  if (isAuthenticated) return <Redirect to={location.state?.from ?? ROUTES.account} />

  const switchMode = (next) => {
    setMode(next)
    setFormError(null)
    reset()
  }

  const onSubmit = async (values) => {
    setFormError(null)
    try {
      if (isRegister) await registerUser(values)
      else await login(values)
      navigate(location.state?.from ?? ROUTES.account, { replace: true })
    } catch (error) {
      setFormError(error?.message ?? 'We could not sign you in. Please try again.')
    }
  }

  return (
    <>
      <Seo
        title={isRegister ? 'Create account' : 'Sign in'}
        description="Sign in to your Amira Fashions account to track orders and keep your wishlist."
        canonicalPath={ROUTES.login}
        noIndex
      />

      <div className="grid min-h-[70vh] lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src={COVER}
            alt=""
            ratio="auto"
            width={1200}
            sizes="50vw"
            priority
            className="absolute inset-0 h-full w-full"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-text/25" />
        </div>

        <div className="flex items-center justify-center px-gutter py-16 sm:py-24">
          <div className="w-full max-w-md">
            <p className="eyebrow mb-4">Your account</p>
            <h1 className="text-fluid-2xl">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="mt-4 text-fluid-sm leading-relaxed text-muted">
              {isRegister
                ? 'Save your details, follow your orders and keep your wishlist across devices.'
                : 'Sign in to track orders, revisit saved pieces and check out faster.'}
            </p>

            <div
              role="tablist"
              aria-label="Account access"
              className="mt-10 flex border-b border-line"
            >
              {[
                { id: 'login', label: 'Sign in' },
                { id: 'register', label: 'Create account' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  onClick={() => switchMode(tab.id)}
                  className={cn(
                    '-mb-px border-b px-4 py-3 text-fluid-xs uppercase tracking-luxe transition-colors duration-250',
                    mode === tab.id
                      ? 'border-text text-text'
                      : 'border-transparent text-muted hover:text-text'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-7">
              {isRegister && (
                <TextField
                  label="Name"
                  required
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name')}
                />
              )}

              <TextField
                label="Email"
                type="email"
                required
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <TextField
                label="Password"
                type="password"
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                hint={isRegister ? 'At least 8 characters' : undefined}
                error={errors.password?.message}
                {...register('password')}
              />

              {!isRegister && <Checkbox label="Keep me signed in on this device" defaultChecked />}

              {formError && (
                <p role="alert" className="text-fluid-sm text-danger">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" fullWidth magnetic={false} isLoading={isSubmitting}>
                {isRegister ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-8 text-fluid-xs leading-relaxed text-muted">
              By continuing you agree to our terms and to receive order updates. We never share your
              details.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
