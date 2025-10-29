import { useLazyTable } from '@/composables/useLazyTable';
import { getCitasAlumno } from '@/service/citaService';

export function usegetCitasAlumno(idUsuario) {
    const load = (page = 0, rows = 10) => {
        return getCitasAlumno(idUsuario, page, rows).then((res) => res.data);
    };

    const tabla = useLazyTable(load);

    return { ...tabla };
}
