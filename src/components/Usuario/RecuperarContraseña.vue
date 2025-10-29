<script setup>
import { cambiarContrasena, generarCodigoRecuperacion, validarCodigoRecuperacion } from '@/service/RecuperarCorreo.js';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({ visible: Boolean });
const emit = defineEmits(['update:visible']);

const activeStep = ref(0);
const correo = ref('');
const codigo = ref('');
const contrasenianueva = ref('');
const contraseniaconirmar = ref('');
const cargando = ref(false);
const toast = useToast();

const steps = [{ label: 'Correo Institucional' }, { label: 'Código de Verificación' }, { label: 'Cambiar Contraseña' }];

function resetFormulario() {
    correo.value = '';
    codigo.value = '';
    contrasenianueva.value = '';
    contraseniaconirmar.value = '';
    activeStep.value = 0;
}

async function avanzarPaso() {
    if (activeStep.value === 0) {
        if (!correo.value.includes('@')) {
            toast.add({ severity: 'warn', summary: 'Correo inválido', detail: 'Ingresa un correo válido.', life: 4000 });
            return;
        }

        try {
            cargando.value = true;
            await generarCodigoRecuperacion(correo.value);
            toast.add({ severity: 'success', summary: 'Código enviado', detail: 'Revisa tu correo.', life: 4000 });
            activeStep.value++;
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al enviar código.';
            toast.add({ severity: 'error', summary: 'Error', detail: mensaje, life: 5000 });
        } finally {
            cargando.value = false;
        }
    } else if (activeStep.value === 1) {
        if (!codigo.value) {
            toast.add({ severity: 'warn', summary: 'Código requerido', detail: 'Ingresa el código recibido.', life: 4000 });
            return;
        }

        try {
            cargando.value = true;
            const res = await validarCodigoRecuperacion(codigo.value, correo.value);
            console.log(res);
            toast.add({ severity: 'success', summary: 'Código válido', detail: 'Continúa con el cambio de contraseña.', life: 4000 });
            activeStep.value++;
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Código incorrecto o expirado.';
            toast.add({ severity: 'error', summary: 'Error', detail: mensaje, life: 5000 });
        }
    } else {
        cargando.value = true;
        if (!contrasenianueva.value || !contraseniaconirmar.value) {
            toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Completa ambos campos.', life: 4000 });
            cargando.value = false;
            return;
        }

        if (contrasenianueva.value !== contraseniaconirmar.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.', life: 5000 });
            cargando.value = false;
            return;
        }

        try {
            cargando.value = true;

            const res = await cambiarContrasena({
                correo: correo.value,
                codigo: codigo.value,
                nuevaContrasena: contrasenianueva.value,
                repetirContrasena: contraseniaconirmar.value
            });

            toast.add({ severity: 'success', summary: 'Contraseña cambiada', detail: 'Ahora puedes iniciar sesión.', life: 5000 });
            cerrarDialogo();
        } catch (error) {
            const mensaje = error.response?.data?.message || 'No se pudo cambiar la contraseña.';
            toast.add({ severity: 'error', summary: 'Error', detail: mensaje, life: 5000 });
        } finally {
            cargando.value = false;
        }
    }
}

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

watch(
    () => props.visible,
    (nuevoValor) => {
        if (!nuevoValor) {
            resetFormulario();
        }
    }
);
</script>

<template>
    <Dialog v-model:visible="props.visible" @update:visible="(val) => emit('update:visible', val)" modal :style="{ width: '50rem' }" :baseZIndex="1300" appendTo="body" class="modal-personalizado">
        <template #header>
            <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                <i class="bi bi-person-fill-lock text-blue-600 dark:text-blue-700" style="font-size: 1.2rem"></i>
                <span class="font-semibold text-blue-600 dark:text-blue-700" style="font-size: 1.1rem; margin-left: 0.5rem">Recuperar Contraseña</span>
            </div>
        </template>

        <Steps :model="steps" :activeStep="activeStep" class="mb-4" />

        <div v-if="activeStep === 0">
            <div class="card-border">
                <label for="correo" class="block font-semibold mb-2">Correo Institucional</label>
                <InputText id="correo" v-model="correo" placeholder="ejemplo@institucion.edu" class="w-full mb-3" />
            </div>
        </div>
        <div v-else-if="activeStep === 1">
            <div class="card-border">
                <label for="codigo" class="block font-semibold mb-2">Código de Verificación</label>
                <InputText id="codigo" v-model="codigo" placeholder="Ingresa el código enviado" class="w-full mb-3" />
            </div>
        </div>
        <div v-else-if="activeStep === 2">
            <div class="card-border">
                <label for="nueva" class="block font-semibold mb-2">Nueva Contraseña</label>
                <Password id="password" v-model="contrasenianueva" placeholder="Contraseña segura" :toggleMask="true" class="w-full" fluid :feedback="false" />

                <label for="confirmar" class="block font-semibold mb-2" style="margin-top: 2rem">Confirmar Contraseña</label>
                <Password id="password" v-model="contraseniaconirmar" placeholder="Contraseña segura" :toggleMask="true" class="w-full" fluid :feedback="false" />
            </div>
        </div>

        <template #footer>
            <Button label="Cerrar" @click="cerrarDialogo" />
            <Button :label="activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'" @click="avanzarPaso" />
        </template>
    </Dialog>
</template>
