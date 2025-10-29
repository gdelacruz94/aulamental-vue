import api from './api';


export async function listarAtencionesApoderado(page = 0, size = 10, nombre = '') {
  const response = await api.get('/api/atencionapoderado/list/apoderados', {
    params: { page, size, nombre }
  })
  return response.data
}

export function listApoderado(nombre) {
  return api.get('/api/atencionapoderado/list/apoderados/select', {
    params: { nombre }
  });
}

export function registrarAtencionApoderado(data) {
  return api.post('/api/atencionapoderado/create/psicologia', data)
}

export function getHistorialAtencionPorApoderado(id, page = 0, size = 10, fecha = '') {
  return api.get(`/api/atencionapoderado/list/apoderado/${id}`, {
    params: { page, size, fecha }
  })
}

export function getDetalleAtencionApoderado(id) {
  return api.get(`/api/atencionapoderado/apoderado/${id}`)
}