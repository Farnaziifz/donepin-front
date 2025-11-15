/**
 * Register page
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../lib/store'
import { api } from '../../../lib/api'
import { useToast } from '../../../lib/hooks'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import type { RegisterRequest } from '../../../lib/types'
import { isValidEmail } from '../../../lib/utils/validators'

const validateEmail = (email: string): boolean => {
  return isValidEmail(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterRequest | 'confirmPassword', string>>
  >({})

  const handleChange = (field: keyof RegisterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequest | 'confirmPassword', string>> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name?.trim() || undefined,
      })
      setAuth(response.accessToken, response.user)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Registration failed', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create an account</h1>
          <p className="text-muted-foreground">Sign up to get started with DonePin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              placeholder="John Doe"
              autoComplete="name"
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

