import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ROUTES } from '../../constants/routes'
import authService from '../../services/authService'
import { useUIStore } from '../../store/uiStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { PasswordField } from '../../components/common/Field'
import Redirect from '../../components/common/Redirect'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Passwords are at least 8 characters.')
      .regex(/[a-zA-Z]/, 'Include at least one letter.')
      .regex(/\d/, 'Include at least one number.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Those passwords do not match.',
    path: ['confirmPassword'],
  })

/**
 * Set a new password.
 *
 * Only reachable with a reset token handed over in router state by the OTP step;
 * arriving here directly bounces back to the start of the flow rather than
 * presenting a form that cannot submit. The token stays out of the URL by design.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useUIStore((state) => state.toast)
  const [formError, setFormError] = useState(null)

  const resetToken = location.state?.resetToken

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  if (!resetToken) return <Redirect to={ROUTES.forgotPassword} />

  const onSubmit = async (values) => {
    setFormError(null)
    try {
      await authService.resetPassword({ resetToken, password: values.password })
      toast({
        title: 'Password updated',
        description: 'Sign in with your new password.',
        variant: 'success',
      })
      navigate(ROUTES.login, { replace: true })
    } catch (error) {
      setFormError(error?.message ?? 'We could not update your password. Please try again.')
    }
  }

  return (
    <>
      <Seo
        title="Set a new password"
        description="Choose a new password for your Amira Fashions account."
        canonicalPath={ROUTES.resetPassword}
        noIndex
      />

      <AuthLayout
        eyebrow="Account recovery"
        title="Set a new password"
        description="Choose something you have not used here before."
        footer={<AuthLink to={ROUTES.login}>Back to sign in</AuthLink>}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-7">
          <PasswordField
            label="New password"
            required
            autoComplete="new-password"
            hint="At least 8 characters, with a letter and a number"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordField
            label="Confirm new password"
            required
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {formError && (
            <p role="alert" className="text-fluid-sm text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth magnetic={false} isLoading={isSubmitting}>
            Update password
          </Button>
        </form>
      </AuthLayout>
    </>
  )
}
