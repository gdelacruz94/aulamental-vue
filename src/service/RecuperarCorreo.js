import api from './api.js';

export const generarCodigoRecuperacion = async (correo) => {
    try {
        const response = await api.get(`/api/password/codeGenerador/${correo}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || 'Error al generar el código';
    }
};

export async function validarCodigoRecuperacion(code, correo) {
    const res = await api.post('/api/password/auth/validarcodigo', {
        code,
        correo
    });
    return res.data;
}

export async function cambiarContrasena(payload) {
    try {
        const res = await api.post('/api/password/auth/cambiarContrasena', payload);
        return res.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al cambiar la contraseña';
    }
}
