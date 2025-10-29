import api from './api';

export async function getDiagnosticos(page = 0, size = 10, search = '') {
  const nombreParam = search ? `&nombre=${search}` : ''
  const response = await api.get(`/api/diagnostico/list?page=${page}&size=${size}${nombreParam}`)
  return response.data
}

export async function listDiagnostico(nombreCadena = '') {
  return api.get('/api/diagnostico/lista', {
    params: { nombre: nombreCadena }
  });
}

export async function crearDiagnostico(diagnostico) {
  return await api.post('/api/diagnostico/create', diagnostico)
}

export async function cambiarEstadoDiagnostico(id) {
    return api.put(`/api/diagnostico/update/estado/${id}`);
}

export const getDiagnosticoById = (id) => {
  return api.get(`/api/diagnostico/${id}`);
};

export const actualizarDiagnostico = (diagnostico) => {
  return api.put('/api/diagnostico/update', diagnostico);
};

export default { getDiagnosticos, crearDiagnostico, cambiarEstadoDiagnostico, listDiagnostico};