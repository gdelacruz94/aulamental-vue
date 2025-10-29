<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import RecuperarContraseña from '@/components/Usuario/RecuperarContraseña.vue';
import { useLogin } from '@/composables/useLogin.js';
import { ref } from 'vue';

const showrecuperar = ref(false);

function openRecuperar() {
    showrecuperar.value = true;
}

localStorage.removeItem('token');
localStorage.removeItem('id');
localStorage.removeItem('nombre');
localStorage.removeItem('roles');
localStorage.removeItem('email');
localStorage.removeItem('alias');

const { correo, contrasenia, handleLogin } = useLogin();
</script>

<template>
    <Toast />
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="conteiner_logo bg-primary-300 dark:bg-primary-500 mx-auto mb-8">
                            <img src="/demo/images/logo.png" alt="Logo del Colegio" class="logo_colegio" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Alberto Benjamin Simpson</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo Institucional</label>
                        <InputText id="email1" type="text" placeholder="Correo Institucional" class="w-full md:w-[30rem] mb-8" v-model="correo" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="contrasenia" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex justify-end mt-1">
                            <span class="font-medium no-underline cursor-pointer text-primary text-sm" @click="openRecuperar">¿Olvidaste tu contraseña?</span>
                        </div>
                        <div class="flex items-center justify-between mt-2 mb-8 gap-8" />
                        <Button label="Iniciar Sesión" class="w-full" @click="handleLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <RecuperarContraseña v-model:visible="showrecuperar" />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
