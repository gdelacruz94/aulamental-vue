import { getDetailsTareasPsicologia } from '@/service/AsignarService';
import { ref } from 'vue';

export function useAsignacionPsicologoStast() {
    const totalpsicologo = ref(0);
    const pendientepsicologo = ref(0);
    const enviadopsicolgo = ref(0);
    const revicionpsicologo = ref(0);
    const completandopsicologo = ref(0);

    async function cargarPsicolgo(idUsuario) {
        try {
            const { data } = await getDetailsTareasPsicologia(idUsuario);
            totalpsicologo.value = data.total;
            pendientepsicologo.value = data.pendiente;
            enviadopsicolgo.value = data.enviados;
            revicionpsicologo.value = data.revicion;
            completandopsicologo.value = data.completados;
        } catch (e) {
            console.error('Error cargando stats de asistencia:', e);
            total.value = pendiente.value = enviado.value = revicion.vue = completando.vue = 0;
        }
    }

    return { totalpsicologo, pendientepsicologo, enviadopsicolgo, revicionpsicologo, completandopsicologo, cargarPsicolgo };
}
