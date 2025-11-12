import type { ApiError } from '../types'
import { API_BASE_URL, API_RETRY_COUNT, API_RETRY_DELAY, STORAGE_KEYS } from '../utils/constants'

/**
 * API Client with retry logic and error handling
 * Currently uses mock data until backend is ready
 */

interface RequestOptions extends RequestInit {
  retries?: number
  retryDelay?: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async retryRequest<T>(
    url: string,
    options: RequestOptions,
    retries: number
  ): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const error: ApiError = {
          message: response.statusText,
          statusCode: response.status,
        }

        try {
          const data = await response.json()
          error.message = data.message || error.message
          error.code = data.code
        } catch {
          // If response is not JSON, use statusText
        }

        // Retry on 5xx errors
        if (response.status >= 500 && retries > 0) {
          await this.delay(options.retryDelay || API_RETRY_DELAY)
          return this.retryRequest(url, options, retries - 1)
        }

        throw error
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && retries > 0 && !(error as ApiError).statusCode) {
        // Network error, retry
        await this.delay(options.retryDelay || API_RETRY_DELAY)
        return this.retryRequest(url, options, retries - 1)
      }
      throw error
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAuthToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const requestOptions: RequestOptions = {
      ...options,
      headers,
      retries: options.retries ?? API_RETRY_COUNT,
      retryDelay: options.retryDelay ?? API_RETRY_DELAY,
    }

    return this.retryRequest<T>(url, requestOptions, requestOptions.retries!)
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

