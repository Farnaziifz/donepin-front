/**
 * React Query hooks for People
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { QUERY_KEYS } from '../../utils/constants'

export function usePeople() {
  return useQuery({
    queryKey: QUERY_KEYS.people,
    queryFn: () => api.getPeople(),
  })
}

