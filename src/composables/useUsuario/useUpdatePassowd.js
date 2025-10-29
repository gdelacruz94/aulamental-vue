import { updatePassword } from '@/service/UsuarioService';

export function useUpdatePassword(idusuario) {
    const useUpdatePassword = (data) => updatePassword(idusuario, data);
    return {
        useUpdatePassword
    };
}
