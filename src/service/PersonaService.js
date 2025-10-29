import api from './api'

export async function getPersonaPorDni(dni) {
  return api.get(`/api/persona/${dni}`)  
}