// @/composables/useUsuario.js
import { getUsuarioById } from '@/service/UsuarioService';
import { ref } from 'vue';

export function useUsuario() {
  const usuario = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const cargarUsuario = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getUsuarioById(id);
      usuario.value = response.data;
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    usuario,
    loading,
    error,
    cargarUsuario
  };
}
