import { getDetailsTareas } from '@/service/AsignarService'
import { ref } from 'vue'

export function useAsignacionPracticantesStast() {
  const total = ref(0)
  const pendiente = ref(0)
  const enviado    = ref(0)
  const revicion   = ref(0)
  const completando =  ref(0)

  async function cargar(idUsuario) {
    try {
      const { data } = await getDetailsTareas(idUsuario)
      total.value = data.total
      pendiente.value = data.pendiente
      enviado.value = data.enviados
      revicion.value = data.revicion
      completando.value = data.completados

    } catch (e) {
      console.error('Error cargando stats de asistencia:', e)
      total.value = pendiente.value = enviado.value = revicion.vue = completando.vue = 0
    }
}

  return { total, pendiente, enviado, revicion, completando,  cargar }
}
