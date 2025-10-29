import api from './api';

export function getDashboardPsicologoBienestar(idUsuario) {
    return api.get(`/api/dashboard/psicologobienestar/${idUsuario}`).then((response) => response.data);
}

export function getDashboardPsicologo(idUsuario) {
    return api.get(`/api/dashboard/psicologo/${idUsuario}`).then((response) => response.data);
}

export function getDashboardDirectora(idUsuario) {
    return api.get(`/api/dashboard/Directora/${idUsuario}`).then((response) => response.data);
}

export function getDashboardBienestar(idUsuario) {
    return api.get(`/api/dashboard/bienestar/${idUsuario}`).then((response) => response.data);
}

export function getDashboardPracticante(idUsuario) {
    return api.get(`/api/dashboard/practicante/${idUsuario}`).then((response) => response.data);
}
