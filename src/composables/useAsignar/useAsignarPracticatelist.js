import { useLazyTable } from '@/composables/useLazyTable'
import { getAsignacionesTareasUser } from '@/service/AsignarService'
import { watch } from 'vue'

export function useAsignacionesPracticante(idUsuario, fechaRef) {
  const load = (page = 0, rows = 10) => {
    const fecha = fechaRef.value
      ? fechaRef.value.toISOString().slice(0, 10)
      : undefined
    return getAsignacionesTareasUser(idUsuario, page, rows, fecha).then(res => res.data)
  }

  const tabla = useLazyTable(load)

  watch(fechaRef, () => tabla.lazyLoad())

  return { ...tabla }
}