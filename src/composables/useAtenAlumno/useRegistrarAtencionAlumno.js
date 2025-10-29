import { registrarAtencionAlumno } from '@/service/AtencionAlumnoService';
import { useToast } from 'primevue/usetoast';

export function useRegistrarAtencionAlumno() {
  const toast = useToast();

  const guardarAtencion = async ({
    idAlumno,
    idUsuario,
    motivo,
    resumen,
    conclusion,
    recomendacion,
    tecnicas,
    comentario,
    idDiagnostico
  }) => {
    if (!idAlumno || !motivo || !resumen || !conclusion || !recomendacion || !tecnicas || !idDiagnostico) {
      toast.add({
        severity: 'warn',
        summary: 'Faltan campos',
        detail: 'Por favor completa todos los campos requeridos.',
        life: 3000
      });
      return false;
    }

    try {
      await registrarAtencionAlumno({
        idAlumno,
        idUsuario,
        motivo,
        resumen,
        conclusion,
        recomendacion,
        tecnicas,
        comentario,
        idDiagnostico
      });

      toast.add({
        severity: 'success',
        summary: 'Registrado',
        detail: 'La atención fue registrada correctamente.',
        life: 3000
      });

      return true;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar la atención.',
        life: 3000
      });
      console.error('Error al registrar atención:', error);
      return false;
    }
  };

  return { guardarAtencion };
}
