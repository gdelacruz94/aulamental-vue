import { useLazyTable } from '@/composables/useLazyTable'
import { listarAtencionesApoderado } from '@/service/AtencionApoderadosService'

export function useAtencionApoderados(){
    const loadData = (page, size, search) =>{
        return listarAtencionesApoderado(page,size,search)
    }
    return useLazyTable(loadData)
}