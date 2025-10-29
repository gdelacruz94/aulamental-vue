<script setup>
import bienestar from '@/components/dashboard/bienestar.vue';
import dashboardDefaul from '@/components/dashboard/dashboardDefaul.vue';
import directora from '@/components/dashboard/directora.vue';
import practicante from '@/components/dashboard/practicante.vue';
import { default as Psicologia, default as psicologia } from '@/components/dashboard/psicologia.vue';
import psicologia_bienestar from '@/components/dashboard/psicologia_bienestar.vue';
import { registrarAsistencia } from '@/service/AsistenciaService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const idUsuario = localStorage.getItem('id');
const toast = useToast();
const claveHoy = `ultimaAsistencia_${idUsuario}`;
const hoy = new Date().toISOString().slice(0, 10);
const roles = JSON.parse(localStorage.getItem('roles') || '[]');

const rolSeleccionado = ref('default');
const nameRol = ref('');

const detectarRol = () => {
    if (roles.includes('Psicologia') && roles.includes('Bienestar')) {
        rolSeleccionado.value = 'psicologia_bienestar';
        nameRol.value = 'Psicologia y Bienestar';
    } else if (roles.includes('Psicologia')) {
        rolSeleccionado.value = 'psicologia';
        nameRol.value = 'Psicologia';
    } else if (roles.includes('Bienestar')) {
        rolSeleccionado.value = 'bienestar';
        nameRol.value = 'Bienestar';
    } else if (roles.includes('Directora')) {
        rolSeleccionado.value = 'directora';
        nameRol.value = 'Directora';
    } else if (roles.includes('Practicante')) {
        rolSeleccionado.value = 'practicante';
        nameRol.value = 'Practicante';
    } else {
        rolSeleccionado.value = 'default';
    }
};

const fechaFormateada = computed(() => {
    const fecha = new Date();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${diaSemana}, ${dia} de ${mes} ${año}`;
});

onMounted(async () => {
    detectarRol();

    if (!idUsuario) return;

    if (localStorage.getItem(claveHoy) === hoy) return;
    try {
        await registrarAsistencia(idUsuario);
        localStorage.setItem(claveHoy, hoy);
        toast.add({
            severity: 'success',
            summary: 'Asistencia registrada',
            life: 2500
        });
    } catch (err) {
        if (err.response?.status === 400) {
            localStorage.setItem(claveHoy, hoy);
            toast.add({
                severity: 'info',
                summary: 'Ya registrada',
                detail: 'Tu asistencia de hoy ya estaba registrada.',
                life: 3000
            });
        } else {
            console.error('No se pudo registrar asistencia:', err);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un problema al registrar la asistencia.',
                life: 3000
            });
        }
    }
});
</script>

<template>
    <div class="mb-4">
        <h2 v-if="rolSeleccionado !== 'default'" class="font-bold text-slate-700 dark:text-white">
            Panel de Control <template v-if="rolSeleccionado !== 'default'"> - {{ nameRol }}</template>
        </h2>
        <span v-if="rolSeleccionado !== 'default'" class="text-gray-500 dark:text-gray-200 font-bold">Panel Informativo – {{ fechaFormateada }}</span>
        <div v-if="rolSeleccionado !== 'default'" style="margin-top: 1rem">
            <span class="text-gray-500 dark:text-gray-200 font-bold">Roles: </span>
            <span v-for="(rol, index) in roles" :key="index" class="estado-badge me-2" :class="rol">
                {{ rol }}
            </span>
        </div>
    </div>

    <psicologia_bienestar v-if="rolSeleccionado === 'psicologia_bienestar'" />
    <psicologia v-else-if="rolSeleccionado === 'psicologia'" />
    <bienestar v-else-if="rolSeleccionado === 'bienestar'" />
    <directora v-else-if="rolSeleccionado === 'directora'" />
    <practicante v-else-if="rolSeleccionado === 'practicante'" />
    <dashboardDefaul v-else />
</template>
