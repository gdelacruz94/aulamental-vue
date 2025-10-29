import { listPsicologo } from '@/service/citaService';
import { ref } from 'vue';

export function usePsicologoSelect() {
  const sugerenciasPsico = ref([]);
  const cargandoPsico = ref(false);

  const buscarPsicologo = async ({ query }) => {

    const texto = query?.trim() ?? ''; 
    cargandoPsico.value = true;

    try {

      const { data } = await listPsicologo(texto);
      sugerenciasPsico.value = data;      
    } catch (err) {
      console.error('Error al buscar psicólogos', err);
      sugerenciasPsico.value = [];
    } finally {
      cargandoPsico.value = false;
    }
  };

  return { sugerenciasPsico, cargandoPsico, buscarPsicologo };
}