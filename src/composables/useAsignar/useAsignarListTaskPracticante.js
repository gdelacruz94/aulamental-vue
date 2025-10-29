import { useLazyTable } from '@/composables/useLazyTable';
import { getTaskAsingar } from '@/service/AsignarService';

export function useAsignarlistTaskPracticante(idUsuario) {
    return useLazyTable((page, size, search) => getTaskAsingar(idUsuario, page, size));
}
