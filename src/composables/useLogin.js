// src/composables/useLogin.js
import { login } from '@/service/authService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useLogin() {
    const correo = ref('');
    const contrasenia = ref('');
    const router = useRouter();
    const toast = useToast();

    const handleLogin = async () => {
        try {
            const res = await login(correo.value, contrasenia.value);
            const token = res.data.token;

            localStorage.setItem('id', res.data.id);
            localStorage.setItem('token', token);
            localStorage.setItem('nombre', res.data.nombre);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('alias', res.data.alias);
            localStorage.setItem('roles', JSON.stringify(res.data.roles));

            toast.add({
                severity: 'success',
                summary: 'Login exitoso',
                detail: 'Bienvenido',
                life: 3000
            });

            router.push('/dashboard');
        } catch (err) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Credenciales incorrectas',
                life: 3000
            });
        }
    };

    return {
        correo,
        contrasenia,
        handleLogin
    };
}
