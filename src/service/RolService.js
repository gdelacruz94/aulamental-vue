import api from './api';

export function getRoles() {
  const id = localStorage.getItem('id');
  if (!id) throw new Error('id no definido en localStorage');

  return api.get(`/api/rol/list/${id}`);
}