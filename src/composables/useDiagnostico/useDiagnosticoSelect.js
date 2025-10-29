import { listDiagnostico } from '@/service/DiagnosticoService';
import { ref } from 'vue';

export function useDiagnosticoSelect() {
  const sugerenciasDiag = ref([]);
  const cargandoDiag    = ref(false);

  const buscarDiagnostico = async ({ query }) => {
    const texto = query?.trim() ?? ''; 
    cargandoDiag.value = true;

    try {
      const { data } = await listDiagnostico(texto);

      sugerenciasDiag.value = (data || []).filter(a =>
        a?.nombre?.toLowerCase().includes(texto.toLowerCase())
      );

    } catch (err) {
      console.error('Error al buscar diagnostico', err);
      sugerenciasDiag.value = [];
    } finally {
      cargandoDiag.value = false;        
    }
  };

  return { sugerenciasDiag, cargandoDiag, buscarDiagnostico };
}