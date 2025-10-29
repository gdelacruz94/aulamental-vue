import api from './api';


function getSucesos(page = 0, size = 10, nombre = '') {
  return api.get('/api/suceso/alumnos/list', {
    params: { page, size, nombre }
  });
}

function createSuceso(payload) {
  return api.post('/api/suceso/create', payload);
}

export function getSucesosStast(id) {
  return api.get(`/api/suceso/alumno/details/${id}`)
}


export function getSucesosByAlumno(idAlumno, page = 0, size = 10, nombre = '') {
  return api.get(`/api/suceso/alumnos/${idAlumno}`, {
    params: { page, size, nombre }
  });
}


export function getDetalleSuceso(id) {
  return api.get(`/api/suceso/alumno/${id}`)
}


export default { getSucesos, createSuceso , getSucesosStast,getSucesosByAlumno , getDetalleSuceso};