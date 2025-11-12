/**
 * React Query hooks for Tags
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { QUERY_KEYS } from '../../utils/constants'

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: () => api.getTags(),
  })
}

