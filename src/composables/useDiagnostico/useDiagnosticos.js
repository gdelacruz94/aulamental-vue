import { useLazyTable } from '@/composables/useLazyTable'
import { getDiagnosticos } from '@/service/DiagnosticoService'

export function useDiagnosticos() {
  return useLazyTable(getDiagnosticos)
}

