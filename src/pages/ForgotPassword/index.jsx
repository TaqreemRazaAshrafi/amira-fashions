import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MailCheck } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import authService from '../../services/authService'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { TextField } from '../../components/common/Field'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'

const requestSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Enter your email or mobile number.')
    .refine(
      (value) => /^\S+@\S+\.\S+$/.test(value) || /^\d{10}$/.test(value),
      'Enter a valid email address or a 10-digit mobile number.'
    ),
})

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code.'),
})

/**
 * Forgot password — request a code, then verify it.
 *
 * The request step's response is deliberately identical whether or not an
 * account exists, so this page cannot be used to discover which addresses are
 * registered. On a verified code we hand the reset token to `/reset-password`
 * through router state rather than the URL, so it never lands in history, in a
 * referrer header or in a shared link.
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('request') // request | verify
  const [identifier, setIdentifier] = useState('')
  const [channel, setChannel] = useState('email')
  const [formError, setFormError] = useState(null)

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { identifier: '' },
  })

  const otpForm = useForm({ resolver: zodResolver(otpSchema), defaultValues: { otp: '' } })

  const onRequest = async (values) => {
    setFormError(null)
    try {
      const response = await authService.forgotPassword({ identifier: values.identifier })
      setIdentifier(values.identifier)
      setChannel(response.channel ?? 'email')
      setStep('verify')
    } catch (error) {
      setFormError(error?.message ?? 'We could not send that code. Please try again.')
    }
  }

  const onVerify = async (values) => {
    setFormError(null)
    try {
      const { resetToken } = await authService.verifyOtp({ identifier, otp: values.otp })
      navigate(ROUTES.resetPassword, { replace: true, state: { resetToken, identifier } })
    } catch (error) {
      setFormError(error?.message ?? 'That code did not work. Please try again.')
    }
  }

  const resend = async () => {
    setFormError(null)
    otpForm.reset()
    await authService.forgotPassword({ identifier })
  }

  return (
    <>
      <Seo
        title="Forgot password"
        description="Reset your Amira Fashions password."
        canonicalPath={ROUTES.forgotPassword}
        noIndex
      />

      <AuthLayout
        eyebrow="Account recovery"
        title={step === 'request' ? 'Reset your password' : 'Enter your code'}
        description={
          step === 'request'
            ? 'Tell us the email or mobile number on your account and we will send a six-digit code.'
            : `We have sent a six-digit code to your ${channel === 'sms' ? 'mobile' : 'email'}. It expires in 10 minutes.`
        }
        footer={
          <>
            Remembered it?{' '}
            <AuthLink to={ROUTES.login}>Back to sign in</AuthLink>
          </>
        }
      >
        {step === 'request' ? (
          <form
            noValidate
            onSubmit={requestForm.handleSubmit(onRequest)}
            className="mt-10 flex flex-col gap-7"
          >
            <TextField
              label="Email or mobile"
              required
              autoComplete="username"
              error={requestForm.formState.errors.identifier?.message}
              {...requestForm.register('identifier')}
            />

            {formError && (
              <p role="alert" className="text-fluid-sm text-danger">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              magnetic={false}
              isLoading={requestForm.formState.isSubmitting}
            >
              Send code
            </Button>
          </form>
        ) : (
          <form
            noValidate
            onSubmit={otpForm.handleSubmit(onVerify)}
            className="mt-10 flex flex-col gap-7"
          >
            <div className="flex items-center gap-3 border border-line bg-surface p-4 text-fluid-sm text-muted">
              <MailCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                Code sent to <span className="text-text">{identifier}</span>
              </span>
            </div>

            <TextField
              label="Six-digit code"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              error={otpForm.formState.errors.otp?.message}
              {...otpForm.register('otp')}
            />

            {formError && (
              <p role="alert" className="text-fluid-sm text-danger">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              magnetic={false}
              isLoading={otpForm.formState.isSubmitting}
            >
              Verify code
            </Button>

            <div className="flex items-center justify-between text-fluid-xs text-muted">
              <button
                type="button"
                onClick={resend}
                className="underline underline-offset-4 transition-colors duration-250 hover:text-text"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('request')
                  setFormError(null)
                }}
                className="underline underline-offset-4 transition-colors duration-250 hover:text-text"
              >
                Use a different address
              </button>
            </div>
          </form>
        )}
      </AuthLayout>
    </>
  )
}
