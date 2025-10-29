<script setup>
import { getMenuPorUsuario } from '@/service/menuService';
import { onMounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

import { ref } from 'vue';

const model = ref([]);
const idusuario = localStorage.getItem('id');

const mapMenu = (items) => {
    if (!items) return null;

    return items.map((item) => ({
        label: item.label,
        icon: item.icon,
        to: item.url || undefined,
        items: mapMenu(item.items)
    }));
};

onMounted(async () => {
    const respuesta = await getMenuPorUsuario(idusuario);
    console.log(respuesta);
    const menuItems = mapMenu(respuesta);

    if (menuItems && menuItems.length > 0) {
        const tieneSubmenus = menuItems.some((item) => item.items && item.items.length > 0);

        if (menuItems.length === 1 && tieneSubmenus) {
            model.value = [
                {
                    label: 'Home',
                    icon: 'bi bi-house-door',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'bi bi-house-fill',
                            to: '/dashboard'
                        },
                        ...menuItems
                    ]
                }
            ];
        } else {
            const cabeceras = menuItems.filter((item) => item.items && item.items.length > 0);
            const itemsSueltos = menuItems.filter((item) => !item.items || item.items.length === 0);

            model.value = [
                {
                    label: 'Home',
                    icon: 'bi bi-house-door',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'bi bi-house-fill',
                            to: '/dashboard'
                        },
                        ...itemsSueltos
                    ]
                },
                ...cabeceras
            ];
        }
    }
});
</script>

<template>
    <Transition name="fade" mode="out-in">
        <ul class="layout-menu" v-if="model.length > 0" key="menu">
            <template v-for="(item, i) in model" :key="i">
                <app-menu-item v-if="!item.separator" :item="item" :index="i" />
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
    </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
