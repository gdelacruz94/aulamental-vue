import api from './api';

export function getUsuarios(idusuario, page = 0, size = 10, nombre = '') {
    return api.get(`/api/usuario/list/${idusuario}`, {
        params: {
            page,
            size,
            nombre
        }
    });
}

export function createUsuario(data) {
    return api.post('/api/usuario/create', data);
}

export function getUsuarioById(id) {
    return api.get(`/api/usuario/${id}`);
}

export const cambiarEstadoUsuario = (idUsuario) => {
    return api.put(`/api/usuario/update/estado/${idUsuario}`);
};

export function updateUsuario(data) {
    return api.put('/api/usuario/update', data);
}

export function updatePassword(idusuario, data) {
    return api.put(`/api/usuario/update/password/${idusuario}`, data);
}

export default {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    cambiarEstadoUsuario,
    updateUsuario,
    updatePassword
};
