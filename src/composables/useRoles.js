import { getRoles } from '@/service/RolService';
import { onMounted, ref } from 'vue';

export function useRoles() {
  const rolesDisponibles = ref([]);
  const error = ref(null);

  const loadRoles = async () => {
    try {
      const { data } = await getRoles();
      rolesDisponibles.value = data;
    } catch (err) {
      console.error('Error al obtener roles:', err);
      error.value = 'No se pudieron cargar los roles';
    }
  };

  onMounted(loadRoles);

  return { rolesDisponibles, error, loadRoles };
}

