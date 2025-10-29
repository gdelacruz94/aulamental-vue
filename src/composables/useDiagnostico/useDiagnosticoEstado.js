
import { cambiarEstadoDiagnostico } from '@/service/DiagnosticoService';
import { useToast } from 'primevue/usetoast';

export function useDiagnosticoEstado() {
  const toast = useToast();

  const cambiarEstado = async (id) => {
    try {
      await cambiarEstadoDiagnostico(id);
      toast.add({
        severity: 'success',
        summary: 'Estado actualizado',
        detail: 'El diagnóstico ha sido actualizado correctamente',
        life: 3000
      });
      return true;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado',
        life: 3000
      });
      console.error('Error al cambiar estado:', error);
      return false;
    }
  };

  return { cambiarEstado };
}
