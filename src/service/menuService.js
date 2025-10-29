import api from './api';

export async function getMenuPorUsuario(idUsuario) {
    const { data } = await api.get(`/api/usuario/menu/${idUsuario}`);
    return data;
}
