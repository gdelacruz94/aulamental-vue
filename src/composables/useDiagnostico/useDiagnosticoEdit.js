import { actualizarDiagnostico } from '@/service/DiagnosticoService';
import { useToast } from 'primevue/usetoast';

export function useDiagnosticoEdit() {
  const toast = useToast();

  const editarDiagnostico = async (diagnostico) => {
    const { id, nombre, descripcion } = diagnostico;

    if (!id || !nombre || !descripcion) {
      toast.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor, complete todos los campos',
        life: 3000
      });
      return false;
    }

    try {
      await actualizarDiagnostico(diagnostico);

      toast.add({
        severity: 'success',
        summary: 'Diagnóstico actualizado',
        detail: 'Se actualizó correctamente',
        life: 3000
      });

      return true;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el diagnóstico',
        life: 3000
      });
      console.error('Error al actualizar diagnóstico:', error);
      return false;
    }
  };

  return { editarDiagnostico };
}
