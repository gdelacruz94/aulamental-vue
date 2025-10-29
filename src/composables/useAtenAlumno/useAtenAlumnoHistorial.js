import { useLazyTable } from '@/composables/useLazyTable'
import { getHistorialAtencionPorAlumno } from '@/service/AtencionAlumnoService'
import { watch } from 'vue'

export function useAtenAlumnoHistorial(idAlumno, fechaRef){
  const load = (page = 0, rows = 10) => {
    const fecha = fechaRef.value
      ? fechaRef.value.toISOString().slice(0, 10)
      : undefined
    return getHistorialAtencionPorAlumno(idAlumno, page, rows, fecha).then(res => res.data)
  }

  const tabla = useLazyTable(load)

  watch(fechaRef, () => tabla.lazyLoad())

   return { ...tabla }
}