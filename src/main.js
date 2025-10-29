import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

const customPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },
        surface: {
            0: '#ffffff',
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

const app = createApp(App);

app.use(router);

app.use(ToastService);

app.use(ConfirmationService);

app.mount('#app');

app.use(PrimeVue, {
    theme: {
        preset: customPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});

window.addEventListener(
    'keydown',
    (e) => {
        if (e.code === 'Space') {
            const tag = e.target.tagName;
            const isEditable = e.target.isContentEditable;
            const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];

            if (isEditable || inputTags.includes(tag)) {
                e.stopPropagation();
            }
        }
    },
    true
);

/*
window.addEventListener('beforeunload', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('nombre')
    localStorage.removeItem('email')
    localStorage.removeItem('alias')
    localStorage.removeItem('roles')
    limpiarAsistenciasLocales()
})

function limpiarAsistenciasLocales() {
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith('ultimaAsistencia_')) {
      localStorage.removeItem(k)
    }
  })
}*/
