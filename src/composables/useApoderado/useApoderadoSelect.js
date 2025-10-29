import { listApoderado } from '@/service/AtencionApoderadosService';
import { ref } from 'vue';

export function useApoderadoSelec() {
  const sugerenciasAPo = ref([]);
  const cargandoApo    = ref(false);

  const buscarApoderado = async ({ query }) => {

    const texto = query?.trim() ?? ''; 
    cargandoApo.value = true;

    try {

      const { data } = await listApoderado(texto);
      sugerenciasAPo.value = data;
      
    } catch (err) {
      console.error('Error al buscar alumnos', err);
      sugerenciasAPo.value = [];
    } finally {
      cargandoApo.value = false;        
    }
  };

  return { sugerenciasAPo, cargandoApo, buscarApoderado };
}