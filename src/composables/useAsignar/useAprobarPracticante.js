import { putAprobarInforme } from '@/service/AsignarService'

export function useAprobarPracticante() {
  async function aprobarInforme(idAsignacion) {
    try {
      await putAprobarInforme(idAsignacion)
      return true
    } catch (error) {
      console.error('Error en aprobarInforme:', error)
      return false
    }
  }

  return { aprobarInforme }
}
