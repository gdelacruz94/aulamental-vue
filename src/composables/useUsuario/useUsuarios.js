import { cambiarEstadoUsuario, createUsuario, getUsuarios } from '@/service/UsuarioService';
import { useLazyTable } from '../useLazyTable';

export function useUsuarios(idusuario) {
    const loadUsuarios = (page, rows, search) => getUsuarios(idusuario, page, rows, search).then((res) => res.data);

    const registrarUsuario = (data) => createUsuario(data);

    const cambiarEstado = (idUsuario) => cambiarEstadoUsuario(idUsuario);

    return {
        ...useLazyTable(loadUsuarios),
        registrarUsuario,
        cambiarEstado
    };
}
