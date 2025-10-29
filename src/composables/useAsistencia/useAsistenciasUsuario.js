import { useLazyTable } from '@/composables/useLazyTable'
import { getAsistenciasUsuario } from '@/service/AsistenciaService'
import { watch } from 'vue'

export function useAsistenciasUsuario(idUsuario, fechaRef) {
  const load = (page = 0, rows = 10) => {
    const fecha = fechaRef.value
      ? fechaRef.value.toISOString().slice(0, 10)
      : undefined
    return getAsistenciasUsuario(idUsuario, page, rows, fecha).then(res => res.data)
  }
  console.log(load)

  const tabla = useLazyTable(load)

  watch(fechaRef, () => tabla.lazyLoad())

  return { ...tabla }
}