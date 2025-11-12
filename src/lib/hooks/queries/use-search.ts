/**
 * React Query hooks for Search
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { QUERY_KEYS } from '../../utils/constants'
import type { SearchRequest } from '../../types'

export function useSearch(request: SearchRequest) {
  return useQuery({
    queryKey: QUERY_KEYS.search(request.query),
    queryFn: () => api.search(request),
    enabled: request.query.length > 0,
  })
}

