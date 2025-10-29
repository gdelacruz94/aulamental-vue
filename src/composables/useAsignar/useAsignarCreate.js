import { registrarTarea } from '@/service/AsignarService'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

export function useAsignarCreate() {
  const loading = ref(false)
  const toast = useToast()

  const guardarTarea = async (data) => {
    loading.value = true
    try {
      await registrarTarea(data)
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea registrada correctamente', life: 3000 })
    } catch (err) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la tarea', life: 3000 })
    } finally {
      loading.value = false
    }
  }

  return { guardarTarea, loading }
}
