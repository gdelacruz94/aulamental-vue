<script setup>
import { useCitaEstado } from '@/composables/useCita/useCitaEstado';
import { defineEmits, defineProps, ref } from 'vue';

const { cambiarEstado } = useCitaEstado();

const props = defineProps({
    visible: Boolean,
    id: Number,
    nombre: String,
    fecha: String,
    hora: String,
    motivo: String,
    estado: String
});
const emit = defineEmits(['update:visible', 'save']);
const observacion = ref('');

function cerrarDialogo() {
    emit('update:visible', false);
}

function resetFormulario() {
    observacion.value = '';
}

async function onConfirmar() {
    const ok = await cambiarEstado({
        idSelec: props.id,
        nuevoEstado: 'CONFIRMADA',
        observaciones: observacion.value
    });
    if (ok) {
        resetFormulario();
        emit('save');
        cerrarDialogo();
    }
}

async function onRechazar() {
    console.log(props.id);
    const ok = await cambiarEstado({
        idSelec: props.id,
        nuevoEstado: 'CANCELADA',
        observaciones: observacion.value
    });
    if (ok) {
        resetFormulario();
        emit('save');
        cerrarDialogo();
    }
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        :style="{ maxWidth: '50rem', width: '40vw' }"
        :breakpoints="{
            '1199px': '80vw',
            '991px': '80vw',
            '767px': '80vw',
            '575px': '80vw'
        }"
    >
        <template #header>
            <div class="flex items-center justify-between w-full pr-2">
                <span class="font-semibold text-lg" style="font-size: 1.2rem">Confirmar Cita</span>
            </div>
        </template>
        <div class="rounded-2xl border border-blue-100 dark:border-blue-900 p-8 bg-blue-50/50 dark:bg-surface-800 max-w-3xl shadow-md">
            <div class="flex items-center space-x-4 mb-6">
                <div class="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white dark:bg-blue-600">
                    <i class="pi pi-user text-2xl"></i>
                </div>
                <div>
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{{ props.nombre }}</div>
                    <div class="text-sm text-blue-600 dark:text-blue-400">Paciente Registrado</div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-surface-700 shadow-sm">
                    <div class="flex items-center space-x-2 mb-3">
                        <i class="pi pi-calendar text-green-500"></i>
                        <span class="text-xs font-semibold uppercase text-green-500">Fecha</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ props.fecha }}</div>
                </div>

                <div class="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-surface-700 shadow-sm">
                    <div class="flex items-center space-x-2 mb-3">
                        <i class="pi pi-clock text-orange-500"></i>
                        <span class="text-xs font-semibold uppercase text-orange-500">Hora</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ props.hora }}</div>
                </div>
            </div>
        </div>

        <div class="card-border" style="margin-top: 1rem">
            <label class="text-gray-500 dark:text-gray-400 mb-1 block">Observacion</label>
            <Textarea v-model="observacion" placeholder="Describe el observacion aquí.." :autoResize="true" rows="5" cols="30" style="width: 100%" />
        </div>
        <template #footer>
            <div class="flex justify-end space-x-4 mt-6">
                <Button label="Cancelar" class="p-button-outlined" @click="cerrarDialogo" />

                <Button label="Rechazar Cita" icon="pi pi-times-circle" severity="danger" :disabled="props.estado !== 'PENDIENTE'" outlined @click="onRechazar" />

                <Button label="Confirmar Cita" icon="pi pi-check-circle" severity="success" :disabled="props.estado !== 'PENDIENTE'" @click="onConfirmar" />
            </div>
        </template>
    </Dialog>
</template>
