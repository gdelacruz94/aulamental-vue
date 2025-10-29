import api from './api'

export async function getAtencionesAlumnos(page = 0, size = 10, nombre = '') {
  try {
    const response = await api.get(`/api/atencionalumno/list/alumnos`, {
      params: {
        page,
        size,
        nombre
      }
    })
    return response.data
  } catch (error) {
    console.error('Error al obtener atenciones:', error)
    throw error
  }
}

export async function getDetalleAlumno(idAlumno) {
  const res = await api.get(`/api/atencionalumno/alumno/details/${idAlumno}`);
  return res.data;
}

export const registrarAtencionAlumno = (data) => {
  return api.post('/api/atencionalumno/create/psicologo', data);
};

export function getHistorialAtencionPorAlumno(id, page = 0, size = 10, fecha = '') {
  return api.get(`/api/atencionalumno/list/alumnos/${id}`, {
    params: { page, size, fecha }
  })
}

export function getDetalleAtencionAlumno(id) {
  return api.get(`/api/atencionalumno/alumno/${id}`)
}


