import { updateUsuario } from '@/service/UsuarioService'
import { ref } from 'vue'

const saving = ref(false)

export function useUsuarioUpdate() {
  async function guardar(payload) {
    saving.value = true
    try {
      await updateUsuario(payload) 
    } finally {
      saving.value = false
    }
  }

  return { guardar, saving }
}