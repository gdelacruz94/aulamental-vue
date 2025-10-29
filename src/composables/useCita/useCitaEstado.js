import { actualizarEstadoCita } from '@/service/citaService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

export function useCitaEstado() {
    const cargando = ref(false);
    const toast = useToast();

    async function cambiarEstado({ idSelec, nuevoEstado, observaciones }) {
        try {
            cargando.value = true;
            await actualizarEstadoCita({
                idSelec,
                estado: nuevoEstado,
                observaciones
            });
            toast.add({ severity: 'success', summary: 'Éxito', detail: `Cita ${nuevoEstado.toLowerCase()}`, life: 3000 });
            return true;
        } catch (error) {
            console.error(error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado', life: 3000 });
            return false;
        } finally {
            cargando.value = false;
        }
    }

    return {
        cargando,
        cambiarEstado
    };
}
