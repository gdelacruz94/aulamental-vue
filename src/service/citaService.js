import api from './api';

export function getCitasAlumno(id, page = 0, size = 10) {
    return api.get(`/api/cita/alumno/${id}`, {
        params: { page, size }
    });
}

export function getCitasPsicologo(id, page = 0, size = 10) {
    return api.get(`/api/cita/psicologo/${id}`, {
        params: { page, size }
    });
}

export function getDetailsCitas(id) {
    return api.get(`/api/cita/psicologo/count/${id}`);
}

export function listPsicologo(nombre) {
    return api.get('/api/cita/psicologo/list', {
        params: { nombre }
    });
}

export function crearCita(cita) {
    return api.post('/api/cita/crear', cita);
}

export async function actualizarEstadoCita({ idSelec, estado, observaciones }) {
    return api.put('/api/cita/estado', {
        id: idSelec,
        estado,
        observaciones
    });
}
