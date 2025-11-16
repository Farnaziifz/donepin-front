/**
 * Validation utilities for form inputs and data
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isValidTaskStatus(value: string): value is 'inbox' | 'todo' | 'in-progress' | 'done' {
  return ['inbox', 'todo', 'in-progress', 'done'].includes(value)
}

export function isValidPriority(value: string): value is 'LOW' | 'MEDIUM' | 'HIGH' {
  return ['LOW', 'MEDIUM', 'HIGH'].includes(value)
}

export function isValidDateString(value: string): boolean {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

export function validateTaskTitle(title: string): { valid: boolean; error?: string } {
  if (!isNonEmptyString(title)) {
    return { valid: false, error: 'Title is required' }
  }
  if (title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' }
  }
  return { valid: true }
}

export function validateNoteContent(content: string): { valid: boolean; error?: string } {
  if (!isNonEmptyString(content)) {
    return { valid: false, error: 'Content is required' }
  }
  return { valid: true }
}

