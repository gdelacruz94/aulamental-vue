import { useLazyTable } from '@/composables/useLazyTable'
import SucesoService from '@/service/SucesoService'
import { watch } from 'vue'

export function useSucesosAlumno(idUsuarioRef) {
  const load = (page, size, search) => {
    const id = idUsuarioRef.value
    if (!id) return Promise.resolve({ content: [], totalElements: 0 })
    return SucesoService.getSucesosByAlumno(id, page, size, search).then(res => res.data)
  }

  const tabla = useLazyTable(load)

  watch(idUsuarioRef, () => {
    if (idUsuarioRef.value) tabla.lazyLoad()
  })

  return tabla
}
