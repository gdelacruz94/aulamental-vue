import AlumnoService from '@/service/AlumnoService';
import { ref } from 'vue';

export function useAlumnosSelect() {
  const sugerencias = ref([]);
  const cargando    = ref(false);

  const buscarAlumnos = async ({ query }) => {

    const texto = query?.trim() ?? ''; 
    cargando.value = true;

    try {
      const { data } = await AlumnoService.listAlumnos(texto);

      sugerencias.value = data.filter(a =>
        a.nombreCompleto.toLowerCase().includes(texto.toLowerCase())
      );
    } catch (err) {
      console.error('Error al buscar alumnos', err);
      sugerencias.value = [];
    } finally {
      cargando.value = false;        
    }
  };

  return { sugerencias, cargando, buscarAlumnos };
}