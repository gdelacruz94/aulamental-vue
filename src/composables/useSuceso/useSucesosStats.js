import { getSucesosStast } from '@/service/SucesoService'
import { ref } from 'vue'

export function useSucesosStats() {
  const baja = ref(0)
  const media = ref(0)
  const alta    = ref(0)
  const alias    = ref(null)

  async function cargar(idUsuario) {
    try {
      const { data } = await getSucesosStast(idUsuario)
      baja.value = data.cantbaja
      media.value = data.cantmedia
      alta.value    = data.cantalta
      alias.value    = data.alias
    } catch (e) {
      console.error('Error cargando stats de asistencia:', e)
      baja.value = media.value = alta.value = 0
    }
  }

  return {alias, baja, media, alta, cargar }
}
