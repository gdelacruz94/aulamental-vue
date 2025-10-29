import api from './api';

export async function getAsignar(page = 0, size = 10, search = '') {
    const nombreParam = search ? `&nombre=${search}` : '';
    const response = await api.get(`/api/asignar/list?page=${page}&size=${size}${nombreParam}`);
    return response.data;
}

export async function getTaskAsingar(id, page = 0, size = 5) {
    const response = await api.get(`/api/asignar/list/task/${id}?page=${page}&size=${size}`);
    return response.data;
}

export function listPracticantes(nombreCadena = '') {
    return api.get('/api/asignar/list/practicate', {
        params: { nombre: nombreCadena }
    });
}

export function registrarTarea(data) {
    return api.post('/api/asignar/create', data);
}

export function getDetailsTareas(id) {
    return api.get(`/api/asignar/practicante/practicante/details/${id}`);
}

export function getDetailsTareasPsicologia(id) {
    return api.get(`/api/asignar/list/psicologo/details/${id}`);
}

export function getAsignacionesTareasUser(id, page = 0, size = 10, fecha = '') {
    return api.get(`/api/asignar/practicante/list/${id}`, {
        params: { page, size, fecha }
    });
}

export function actualizarAtencionAlumno(data) {
    return api.put('/api/asignar/practicante/atencionAlumno', data);
}

export function actualizarAtencionApoderado(data) {
    return api.put('/api/asignar/practicante/atencionApoderado', data);
}

export async function putObservacionRechazo(idAsignacion, observacion) {
    return api.put(`/api/asignar/practicante/rechazado/${idAsignacion}`, null, {
        params: { observacion }
    });
}

export async function putAprobarInforme(idAsignacion) {
    return api.put(`/api/asignar/practicante/aprobado/${idAsignacion}`);
}
