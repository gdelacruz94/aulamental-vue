import { getDetalleAlumno } from '@/service/AtencionAlumnoService';
import { ref } from 'vue';

export function useAlumnoDetalle() {
  const detalle = ref({});
  const cargando = ref(false);

  const cargarDetalle = async (id) => {
    try {
      cargando.value = true;
      detalle.value = await getDetalleAlumno(id);
    } catch (err) {
      console.error('Error al cargar detalle del alumno:', err);
    } finally {
      cargando.value = false;
    }
  };

  return { detalle, cargarDetalle, cargando };
}