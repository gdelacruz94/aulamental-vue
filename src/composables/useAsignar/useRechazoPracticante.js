import { putObservacionRechazo } from '@/service/AsignarService'

export function useRechazoPracticante() {
  async function enviarRechazo(idAsignacion, observacion) {
    try {
      await putObservacionRechazo(idAsignacion, observacion)
      return true
    } catch (error) {
      console.error('Error al enviar observación de rechazo', error)
      return false
    }
  }

  return { enviarRechazo }
}
