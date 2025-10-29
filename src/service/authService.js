import api from './api';

export function login(correo, contrasenia) {
  return api.post('/login', { correo, contrasenia });
}

export function logout() {
  localStorage.removeItem('token');
}


export function jwtExpirado(token) {
  if (!token) return true
  const [, payload] = token.split('.')
  if (!payload) return true

  try {
    const { exp } = JSON.parse(atob(payload))
    const ahora = Math.floor(Date.now() / 1000)
    return exp && ahora >= exp
    localStorage.removeItem('token');
    localStorage.removeItem('nombre')
    localStorage.removeItem('id');
    window.location.href = '/login';
    
  } catch {
    return true
  }
}


export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('nombre')
  localStorage.removeItem('id');
  window.location.href = '/login';
}
