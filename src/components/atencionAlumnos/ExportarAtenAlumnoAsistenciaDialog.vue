<script setup>
import { descargarPdfAsistenciaPorMesYAnio } from '@/service/ExportarService';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({ visible: Boolean });
const emit = defineEmits(['update:visible']);

const dropdownValues = [
    { name: 'Enero', value: 1 },
    { name: 'Febrero', value: 2 },
    { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Mayo', value: 5 },
    { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 },
    { name: 'Noviembre', value: 11 },
    { name: 'Diciembre', value: 12 }
];

const dropdownValue = ref(null);
const anio = ref(null);

function reiniciarFechaActual() {
    const fechaActual = new Date();
    dropdownValue.value = {
        name: dropdownValues[fechaActual.getMonth()].name,
        value: fechaActual.getMonth() + 1
    };
    anio.value = fechaActual.getFullYear();
}

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            reiniciarFechaActual();
        }
    }
);

async function descargarAsistencia() {
    const mes = dropdownValue.value?.value;
    const anioActual = anio.value;
    await descargarPdfAsistenciaPorMesYAnio(mes, anioActual);
}

function cerrarDialogo() {
    emit('update:visible', false);
}
</script>

<template>
    <Dialog v-model:visible="props.visible" @update:visible="(val) => emit('update:visible', val)" modal class="modal-personalizado" :style="{ width: '40rem' }">
        <template #header>
            <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                <i class="bi bi-file-earmark-text text-blue-600 dark:text-blue-700" style="font-size: 1.2rem"></i>
                <span class="font-semibold text-blue-600 dark:text-blue-700" style="font-size: 1.1rem; margin-left: 0.5rem">Descargar archivo de Asistencia</span>
            </div>
        </template>
        <div class="card-border">
            <div class="p-fluid grid gap-3 mt-4">
                <!-- Selector de Mes -->
                <div class="col-12 md:col-6">
                    <label for="mes" class="font-semibold mb-2 block">Mes:</label>
                    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Seleccionar mes" class="w-full" />
                </div>

                <!-- Input de Año -->
                <div class="col-12 md:col-6">
                    <label for="anio" class="font-semibold mb-2 block">Año:</label>
                    <input type="number" v-model="anio" id="anio" class="w-full border rounded px-3 py-2" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cerrar" @click="cerrarDialogo" />
            <Button label="Descargar PDF" icon="pi pi-download" @click="descargarAsistencia" severity="help" />
        </template>
    </Dialog>
</template>
