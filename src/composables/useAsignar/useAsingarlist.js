import { useLazyTable } from '@/composables/useLazyTable'
import { getAsignar } from '@/service/AsignarService'

export function useAsignarlist() {
  return useLazyTable(getAsignar)
}

