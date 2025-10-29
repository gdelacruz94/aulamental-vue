import { actualizarAtencionAlumno, actualizarAtencionApoderado } from '@/service/AsignarService'
import { useToast } from 'primevue/usetoast'

export function useAtencionPracticante() {
  const toast = useToast()

  async function guardarAtencionAlumno(payload) {
  try {
    await actualizarAtencionAlumno(payload)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Atención del alumno actualizada', life: 3000 })
    return true
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la atención del alumno', life: 3000 })
    return false
  }
}

async function guardarAtencionApoderado(payload) {
  try {
    await actualizarAtencionApoderado(payload)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Atención del apoderado actualizada', life: 3000 })
    return true
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la atención del apoderado', life: 3000 })
    return false
  }
}


  return {
    guardarAtencionAlumno,
    guardarAtencionApoderado
  }
}
