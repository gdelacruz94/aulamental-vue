<script setup>
import { useUpdatePassword as updatePasswordComposable } from '@/composables/useUsuario/useUpdatePassowd';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
    visible: Boolean
});
const emit = defineEmits(['update:visible']);

const localVisible = ref(props.visible);
const idusuario = localStorage.getItem('id');
const alias = localStorage.getItem('alias');
const nombre = localStorage.getItem('nombre');
const correo = localStorage.getItem('email');

const contrasenaActual = ref('');
const nuevaContrasena = ref('');
const confirmarContrasena = ref('');

const { useUpdatePassword } = updatePasswordComposable(idusuario);
const toast = useToast();

watch(
    () => props.visible,
    (val) => {
        localVisible.value = val;
    }
);

// emitir al padre los cambios locales
watch(localVisible, (val) => {
    emit('update:visible', val);
});

const roles = JSON.parse(localStorage.getItem('roles') || '[]');

function close() {
    localVisible.value = false;
    resetForm();
    document.body.style.overflow = '';
}

function onHide() {
    resetForm();
    document.body.style.overflow = '';
}
function resetForm() {
    contrasenaActual.value = '';
    nuevaContrasena.value = '';
    confirmarContrasena.value = '';
}

async function cambiarContrasena() {
    if (nuevaContrasena.value !== confirmarContrasena.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 });
        return;
    }

    const data = {
        contraseñaActual: contrasenaActual.value,
        nuevaContraseña: nuevaContrasena.value,
        confirmarContraseña: confirmarContrasena.value
    };

    try {
        await useUpdatePassword(data);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente', life: 3000 });
        resetForm();
        close();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cambiar la contraseña', life: 3000 });
    }
}
</script>

<template>
    <Dialog v-model:visible="localVisible" header="Perfil de Usuario" style="width: 400px" modal class="modal-personalizado" blockScroll @hide="onHide">
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Perfil de Usuario</h2>
            </div>
        </template>
        <!-- Perfil -->
        <div class="card-border">
            <div class="flex items-center gap-4 mb-1">
                <div class="bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold" style="width: 50px; height: 50px">{{ alias }}</div>
                <div class="flex flex-col justify-center leading-tight">
                    <p class="font-semibold m-0">{{ nombre }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 m-0">{{ correo }}</p>
                </div>
            </div>
        </div>

        <hr class="my-4 border-gray-300 dark:border-gray-700" />

        <!-- Cambiar Contraseña -->
        <div class="card-border">
            <h3 class="text-sm mb-3" style="font-size: 1rem">Cambiar Contraseña</h3>
            <div class="space-y-3 mb-4">
                <div class="relative">
                    <label for="contrasenaActual" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                    <Password id="password1" v-model="contrasenaActual" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                </div>
                <div class="relative">
                    <label for="nuevaContrasena" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                    <Password id="password2" v-model="nuevaContrasena" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                </div>
                <div class="relative">
                    <label for="confirmarContrasena" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                    <Password id="password3" v-model="confirmarContrasena" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                </div>
            </div>
            <Button label="Guardar Cambios" class="w-full" @click="cambiarContrasena"></Button>
        </div>
    </Dialog>
</template>
