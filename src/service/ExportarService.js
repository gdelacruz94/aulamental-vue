import api from './api';

export async function descargarPdfSucesos(idAlumno) {
    try {
        const response = await api.get(`/api/exportar/sucesos/${idAlumno}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SucesosAlumno.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
    }
}

export async function descargarPdfSuceso(idSuceso, idAlumno) {
    try {
        const response = await api.get(`/api/exportar/suceso/${idSuceso}/${idAlumno}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Suceso_${idSuceso}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar PDF del suceso:', error);
    }
}

export async function descargarPdfSeguimientoAtencionAlumno(idAtencion) {
    try {
        const response = await api.get(`/api/exportar/atenalumno/seguimineto/${idAtencion}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Seguimiento_Atencion_${idAtencion}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el seguimiento:', error);
    }
}

export async function descargarPdfAtencionAlumno(idAtencion, idUsuario) {
    try {
        const response = await api.get(`/api/exportar/atenalumno/${idAtencion}/${idUsuario}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AtencionAlumno_${idAtencion}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar atención alumno:', error);
    }
}

export async function descargarPdfAsistenciaPorMesYAnio(mes, anio) {
    try {
        const response = await api.get(`/api/exportar/atenalumno/asistencia/${mes}/${anio}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = ` REGISTRO_ATENCIÓN_PSICOLÓGICA_ESTUDIANTES_${mes}_${anio}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el PDF de asistencia:', error);
    }
}

export async function descargarPdfAtencionApoderado(idAtencion, idUsuario) {
    try {
        const response = await api.get(`/api/exportar/atenapoderado/${idAtencion}/${idUsuario}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AtencionApoderado_${idAtencion}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar atención apoderado:', error);
    }
}

export async function descargarPdfAsistenciaAtencionApoderado(mes, anio) {
    try {
        const response = await api.get(`/api/exportar/atenapoderado/asistencia/${mes}/${anio}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Asistencia_Apoderado_${mes}_${anio}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar asistencia apoderado:', error);
    }
}
