import { ref } from 'vue';
import { getDiagnosticoById } from '@/service/DiagnosticoService';

export function useDiagnosticoDetails() {
  const diagnostico = ref({});
  const loading = ref(false);

  const cargarDiagnostico = async (id) => {
    loading.value = true;
    try {
      const res = await getDiagnosticoById(id);
      diagnostico.value = res.data;
    } catch (error) {
      console.error('Error al cargar diagnóstico:', error);
    } finally {
      loading.value = false;
    }
  };

  return { diagnostico, loading, cargarDiagnostico };
}
