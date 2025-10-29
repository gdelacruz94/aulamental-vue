import { listPracticantes } from '@/service/AsignarService';
import { ref } from 'vue';

export function usePracticantesSelect() {
  const sugerenciasPrac = ref([]);
  const cargandoPrac    = ref(false);

  const buscarPracticante = async ({ query }) => {

    const texto = query?.trim() ?? ''; 
    cargandoPrac.value = true;

    try {
      const { data } = await listPracticantes(texto);

      sugerenciasPrac.value = data.filter(a =>
        a.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    } catch (err) {
      console.error('Error al buscar alumnos', err);
      sugerenciasPrac.value = [];
    } finally {
      cargandoPrac.value = false;        
    }
  };

  return { sugerenciasPrac, cargandoPrac, buscarPracticante };
}