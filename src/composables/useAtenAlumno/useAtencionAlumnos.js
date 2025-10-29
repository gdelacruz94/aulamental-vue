import { getAtencionesAlumnos } from '@/service/AtencionAlumnoService'
import { useLazyTable } from '@/composables/useLazyTable'

export function useAtencionAlumnos() {
  const loadData = (page, size, search) => {
    return getAtencionesAlumnos(page, size, search)
  }

  return useLazyTable(loadData)
}
