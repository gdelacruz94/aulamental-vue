import api from './api';

export function getAsistenciaStats(id) {
    return api.get(`/api/asistencia/usuario/count/${id}`);
}

export function getAsistencias(idusuario, page = 0, size = 10, nombre = '') {
    return api.get(`/api/asistencia/list/${idusuario}`, {
        params: {
            page,
            size,
            nombre
        }
    });
}

export function getAsistenciasUsuario(id, page = 0, size = 10, fecha = '') {
    return api.get(`/api/asistencia/list/usuario/${id}`, {
        params: { page, size, fecha }
    });
}

export function registrarAsistencia(idUsuario) {
    return api.post(`/api/asistencia/create/${idUsuario}`);
}
