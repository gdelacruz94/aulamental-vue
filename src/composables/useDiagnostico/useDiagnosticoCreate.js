import { crearDiagnostico } from '@/service/DiagnosticoService'
import { useToast } from 'primevue/usetoast'

export function useDiagnostico() {
  const toast = useToast()

  const guardarDiagnostico = async (diagnostico) => {
    const { nombre, descripcion } = diagnostico

    if (!nombre || !descripcion) {
      toast.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Complete todos los campos',
        life: 3000
      })
      return false
    }

    try {
      await crearDiagnostico(diagnostico)

      toast.add({
        severity: 'success',
        summary: 'Diagnóstico registrado',
        detail: 'Se registró correctamente',
        life: 3000
      })

      return true
    } catch (err) {
      const mensajeBackend = err?.response?.data?.message || 'No se pudo registrar el diagnóstico'

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: mensajeBackend,
        life: 4000
      })

      console.error('Error al registrar diagnóstico:', err)
      return false
    }
  }
  
  return { guardarDiagnostico }
}
