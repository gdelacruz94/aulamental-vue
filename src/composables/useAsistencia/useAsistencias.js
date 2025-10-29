import { useLazyTable } from '@/composables/useLazyTable'
import { getAsistencias } from '@/service/AsistenciaService'

export function useAsistencias(userId) {
  const loadAsistencias = (page, rows, search) =>
    getAsistencias(userId, page, rows, search).then(res => res.data)

  return {
    ...useLazyTable(loadAsistencias)
  }
}
