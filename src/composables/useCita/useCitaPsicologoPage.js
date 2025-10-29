import { useLazyTable } from '@/composables/useLazyTable';
import { getCitasPsicologo } from '@/service/citaService';

export function usegetCitasPsicologo(idUsuario) {
    const load = (page = 0, rows = 10) => {
        return getCitasPsicologo(idUsuario, page, rows).then((res) => res.data);
    };

    const tabla = useLazyTable(load);

    return { ...tabla };
}
