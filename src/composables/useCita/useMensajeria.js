import { enviarCitacion } from '@/service/mensajeriaService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

export function useMensajeria() {
    const loading = ref(false);
    const toast = useToast();

    const enviarMensajeCitacion = async (payload, closeDialogCallback) => {
        loading.value = true;
        try {
            await enviarCitacion(payload);
            toast.add({ severity: 'success', summary: 'Enviado', detail: 'Citación enviada correctamente', life: 3000 });

            if (closeDialogCallback) closeDialogCallback();
        } catch (error) {
            const mensajeError = error.response?.data?.message || 'No se pudo enviar la citación';

            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: mensajeError,
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        enviarMensajeCitacion,
        loading
    };
}
