<script setup>
import { menuDropdownPerfil } from '@/assets/js/custom-ui';
import { useLayout } from '@/layout/composables/layout';
import { cerrarSesion } from '@/service/authService';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
    abrirPerfil: Function
});

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const nombreUsuario = ref('');
const alias = ref('');
const email = ref('');

onMounted(() => {
    nombreUsuario.value = localStorage.getItem('nombre') || 'Usuario';
    alias.value = localStorage.getItem('alias') || 'U';
    email.value = localStorage.getItem('email') || 'usuario@example.com';
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu" style="margin-top: -0.2rem">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/dashboard" class="layout-topbar-logo">
                <div class="logo-section">
                    <div class="conteiner_logo_dasboard">
                        <div class="w-15 h-15 bg-primary-300 dark:bg-primary-300 rounded-lg flex items-center justify-center p-1.5">
                            <img src="/demo/images/logo.png" alt="Logo" class="logo-colegio-dasboard" />
                        </div>
                    </div>
                    <div class="text-section">
                        <div class="main-text">
                            <span class="hidden sm:inline font-semibold text-slate-700 dark:text-slate-200 text-xl">Colegio Alberto Benjamin Simpson</span>
                        </div>
                        <span class="hidden sm:inline font-semibold text-slate-500 dark:text-slate-400 text-xs">Aula Mental</span>
                    </div>
                </div>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]" style="font-size: 1.5rem"></i>
                </button>

                <button type="button" @click="menuDropdownPerfil" class="account-toggle flex items-center hover:bg-gray-300 dark:hover:bg-[#26262a] transition" id="btnperfil">
                    <Avatar :label="alias" class="mr-0 p-2 text-xs" size="large" />
                    <div class="conteniner-user hidden sm:flex flex-col" style="width: 80%">
                        <span class="hidden sm:inline text-lg font-medium" style="margin-left: 0.3rem">{{ nombreUsuario }}</span>
                        <span class="hidden sm:inline text-xs font-semibold text-slate-500 dark:text-slate-400" style="margin-left: 0.3rem">{{ email }}</span>
                    </div>
                    <i class="pi pi-chevron-down ml-2 hidden sm:inline" style="margin-left: 1.5rem; margin-right: 0.4rem" />
                </button>

                <div class="menu-dropdown bg-white dark:bg-[#26262a]" id="menuperfil">
                    <span class="text-normal font-semibold text-slate-700 dark:text-slate-200 px-2 py-1 my-2 mx-2">Mi Cuenta</span>
                    <hr class="border-t border-gray-300 dark:border-gray-700 my-1 mx-2" />
                    <button class="menu-btn perfil-btn" @click="props.abrirPerfil">
                        <div class="menu-item">
                            <i class="pi pi-user" style="font-size: 1.2rem"></i>
                            <span>Perfil</span>
                        </div>
                    </button>
                    <button class="menu-btn cerrar-btn" @click="cerrarSesion">
                        <div class="menu-item">
                            <i class="pi pi-sign-out" style="font-size: 1.2rem"></i>
                            <span>Cerrar Sesión</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
