import { getPersonaPorDni } from '@/service/PersonaService'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

export function usePersona() {
  const loading = ref(false)
  const persona = ref(null)
  const toast   = useToast()

  async function buscarPersona(dni) {
    loading.value = true
    try {
      const { data } = await getPersonaPorDni(dni)
      persona.value = data
      return data
    } catch (e) {
      toast.add({
        severity: 'error',
        summary : 'No encontrado',
        detail  : 'No se halló información para ese DNI.',
        life    : 4000
      })
      throw e
    } finally {
      loading.value = false
    }
  }

  return { persona, loading, buscarPersona }
}
