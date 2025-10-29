import api from './api';

export async function enviarCitacion(data) {
    return await api.post('/api/mensajeria/enviar', data);
}
