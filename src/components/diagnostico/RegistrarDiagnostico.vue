<script setup>
import { useDiagnostico } from '@/composables/useDiagnostico/useDiagnosticoCreate';
import { defineEmits, defineProps, ref, watch } from 'vue';

const emit = defineEmits(['update:visible', 'save']);

const props = defineProps({
    visible: Boolean
});

const visibleLocal = ref(false);
const nombre = ref('');
const descripcion = ref('');

const { guardarDiagnostico } = useDiagnostico();

watch(
    () => props.visible,
    (val) => {
        visibleLocal.value = val;
    }
);

watch(visibleLocal, (val) => {
    emit('update:visible', val);
});

watch(
    () => props.visible,
    (val) => {
        visibleLocal.value = val;
        if (val) {
            resetFormulario();
        }
    }
);

function cerrarDialogo() {
    emit('update:visible', false);
}

const onGuardar = async () => {
    const success = await guardarDiagnostico({
        nombre: nombre.value,
        descripcion: descripcion.value
    });

    if (success) {
        cerrarDialogo();
        emit('save');
        nombre.value = '';
        descripcion.value = '';
    }
};

function resetFormulario() {
    nombre.value = '';
    descripcion.value = '';
}
</script>

<template>
    <Dialog
        v-model:visible="visibleLocal"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        class="modal-personalizado"
        :style="{ maxWidth: '45rem', width: '76vw' }"
        :breakpoints="{
            '1199px': '75vw',
            '991px': '85vw',
            '767px': '95vw',
            '575px': '98vw'
        }"
    >
        <template #header>
            <div class="diseño-header-modal">
                <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                    <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion">
                        <i class="bi bi-postcard-heart" style="font-size: 1.5rem" />
                    </div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-gray-900 dark:text-surface-0" style="font-size: 1.3rem">Registrar Diagnostico</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="card-border">
            <!-- Nombre -->
            <div class="flex flex-col md:flex-row gap-4 mt-2">
                <div class="flex flex-col gap-2 w-full">
                    <label for="telefono" class="font-medium">Nombre</label>
                    <InputText id="nombre" v-model="nombre" placeholder="Ej: Dificultades de adaptación social leves" />
                </div>
            </div>
            <!-- Descricion -->
            <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1rem">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="telefono">Descripcion</label>
                    <Textarea id="argumento" v-model="descripcion" placeholder="Descripcion de Diagnostico..." rows="4" autoResize class="w-full" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cerrar" class="p-button-outlined" @click="cerrarDialogo" />
            <Button label="Guardar" severity="success" icon="pi pi-check" @click="onGuardar" />
        </template>
    </Dialog>
</template>
