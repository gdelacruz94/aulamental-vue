import { useLazyTable } from '@/composables/useLazyTable'
import { listALumnoPage } from '@/service/AlumnoService'

export function useAlumnos() {
  const loadData = (page, size, search) => {
    return listALumnoPage(page, size, search)
  }

  return useLazyTable(loadData)
}
