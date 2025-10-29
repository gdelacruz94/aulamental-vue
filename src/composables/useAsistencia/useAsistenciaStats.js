import { getAsistenciaStats } from '@/service/AsistenciaService'
import { ref } from 'vue'

export function useAsistenciaStats() {
  const presente = ref(0)
  const tardanza = ref(0)
  const falta    = ref(0)
  const alias    = ref(null)

  async function cargar(idUsuario) {
    try {
      const { data } = await getAsistenciaStats(idUsuario)
      presente.value = data.cantPresente
      tardanza.value = data.cantTardanza
      falta.value    = data.cantFalto
      alias.value    = data.alias
    } catch (e) {
      console.error('Error cargando stats de asistencia:', e)
      presente.value = tardanza.value = falta.value = 0
    }
  }

  return { alias, presente, tardanza, falta, cargar }
}
