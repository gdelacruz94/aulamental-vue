import { getDetailsCitas } from '@/service/citaService';
import { ref } from 'vue';

export function useCitasDetailsPsicologo() {
    const total = ref(0);
    const pendiente = ref(0);
    const confirmadas = ref(0);
    const cancelados = ref(0);

    async function cargar(idUsuario) {
        try {
            const { data } = await getDetailsCitas(idUsuario);
            total.value = data.total;
            pendiente.value = data.pendiente;
            confirmadas.value = data.confirmada;
            cancelados.value = data.cancelada;
        } catch (e) {
            console.error('Error cargando stats de asistencia:', e);
            total.value = pendiente.value = confirmadas.value = cancelados.value = 0;
        }
    }

    return { total, pendiente, confirmadas, cancelados, cargar };
}
