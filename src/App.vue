<script setup>
import PerfilDialog from '@/components/Usuario/PerfilDialog.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const showPerfilModal = ref(false);

const abrirPerfil = () => {
    showPerfilModal.value = true;
};

const route = useRoute();

const isLoginRoute = computed(() => route.path === '/login');
</script>

<template>
    <!-- SOLO LOGIN -->
    <router-view v-if="isLoginRoute" />

    <!-- TODO LO DEMÁS -->
    <router-view v-else :abrir-perfil="abrirPerfil" />

    <!-- MODAL GLOBAL -->
    <PerfilDialog v-if="!isLoginRoute" v-model:visible="showPerfilModal" />
</template>

<style scoped></style>
