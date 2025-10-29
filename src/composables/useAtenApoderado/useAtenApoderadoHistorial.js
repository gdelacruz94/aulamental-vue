import { useLazyTable } from '@/composables/useLazyTable'
import { getHistorialAtencionPorApoderado } from '@/service/AtencionApoderadosService'
import { watch } from 'vue'

export function useatenapoderadoHistoria(idApoderado, fechaRef){
  const load = (page = 0, rows = 10) => {
    const fecha = fechaRef.value
      ? fechaRef.value.toISOString().slice(0, 10)
      : undefined
    return getHistorialAtencionPorApoderado(idApoderado, page, rows, fecha).then(res => res.data)
  }

  const tabla = useLazyTable(load)

  watch(fechaRef, () => tabla.lazyLoad())

   return { ...tabla }
}