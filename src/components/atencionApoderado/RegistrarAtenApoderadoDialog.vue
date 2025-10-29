<script setup>
import { useApoderadoSelec } from '@/composables/useApoderado/useApoderadoSelect';
import { useRegistrarAtencionApoderado } from '@/composables/useAtenApoderado/useRegistrarAtencionApoderado';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const toast = useToast();

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible', 'save']);
const { sugerenciasAPo, cargandoApo, buscarApoderado } = useApoderadoSelec();
const apoderadoSelec = ref(null);

const motivo = ref('');
const resumen = ref('');
const conclusion = ref('');
const intervenciones = ref('');
const recomendacion = ref('');
const comentario = ref('');

const activeStep = ref(0);

const steps = [{ label: 'Registro Inicial' }, { label: 'Evaluación' }];

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

const pasoActual = computed(() => `Paso ${activeStep.value + 1} de ${steps.length}: ${steps[activeStep.value].label}`);

function siguientePaso() {
    if (activeStep.value === 0) {
        if (!apoderadoSelec.value) {
            toast.add({ severity: 'warn', summary: 'Apoderado requerido', detail: 'Debes seleccionar un apoderado antes de continuar', life: 3000 });
            return;
        }
        if (!motivo.value.trim() || !resumen.value.trim()) {
            toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa el motivo y resumen antes de continuar', life: 3000 });
            return;
        }
    }

    if (activeStep.value < steps.length - 1) {
        activeStep.value++;
    }
}

function pasoAnterior() {
    if (activeStep.value > 0) activeStep.value--;
}

function resetFormulario() {
    apoderadoSelec.value = null;
    motivo.value = '';
    resumen.value = '';
    conclusion.value = '';
    intervenciones.value = '';
    recomendacion.value = '';
    comentario.value = '';
    activeStep.value = 0;
}

const { registrar } = useRegistrarAtencionApoderado();

const registrarAtencion = async () => {
    if (!conclusion.value.trim() || !recomendacion.value.trim() || !intervenciones.value.trim() || !comentario.value.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Campos incompletos',
            detail: 'Completa todos los campos de evaluación antes de guardar',
            life: 3000
        });
        return;
    }

    try {
        await registrar({
            idPsicologo: localStorage.getItem('id'),
            idApoderado: apoderadoSelec.value.id,
            motivo: motivo.value,
            resumen: resumen.value,
            conclusiones: conclusion.value,
            recomendaciones: recomendacion.value,
            intervencion: intervenciones.value,
            comentario: comentario.value
        });
        emit('save');
        toast.add({ severity: 'success', summary: 'Atención registrada', life: 3000 });
        cerrarDialogo();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error al registrar', detail: 'Revisa los campos' });
    }
};
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="
            (val) => {
                if (!val) cerrarDialogo();
            }
        "
        modal
        class="modal-personalizado"
        :style="{ maxWidth: '80rem', width: '90vw' }"
        :breakpoints="{
            '1199px': '75vw',
            '991px': '85vw',
            '767px': '95vw',
            '575px': '98vw'
        }"
    >
        <!-- encabezado -->
        <template #header>
            <div class="flex flex-col">
                <span class="titulo-registrar">Registrar Nueva Atencion</span>
                <span class="titulo-registrar-cantida-usuario">{{ pasoActual }}</span>
            </div>
        </template>
        <!-- steps -->
        <Steps :model="steps" :activeStep="activeStep" class="mb-4" />
        <div class="p-4">
            <div class="contenedor-modal" v-if="activeStep === 0">
                <!-- Informacion-->
                <div class="card-border-info dp">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="bi bi-person-check-fill" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Seleccion y Motivo</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Selecciona el Apoderado y describe el motivo de la atención</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="telefono">Seleccionar Apoderado</label>
                        <AutoComplete
                            v-model="apoderadoSelec"
                            :suggestions="sugerenciasAPo"
                            optionLabel="nombrecompleto"
                            dropdown
                            placeholder="Buscar apoderado..."
                            class="w-full"
                            :minLength="1"
                            :forceSelection="true"
                            @complete="buscarApoderado"
                            @focus="buscarApoderado({ query: '' })"
                            :panelClass="'shadow-lg rounded-lg'"
                            inputClass="rounded-md"
                        >
                            <template #option="{ option }">
                                <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors cursor-pointer">
                                    <span class="text-blue-600 dark:text-blue-400">{{ option.alias }}</span>
                                    <div class="flex flex-col leading-tight">
                                        <span class="font-medium text-gray-800 dark:text-gray-200">
                                            {{ option.nombrecompleto }}
                                        </span>
                                        <small class="text-gray-500 dark:text-gray-400"> {{ option.tdocumento }} : {{ option.ndocumento }} </small>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div v-if="apoderadoSelec" class="card-border-retangular mt-4">
                        <div class="flex justify-between items-center text-sm gap-4 flex-wrap">
                            <div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
                                <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Documento:</strong> {{ apoderadoSelec.tdocumento }} - {{ apoderadoSelec.ndocumento }}</span>
                                <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Atenciones:</strong> {{ apoderadoSelec.cantiAtencion }} registradas</span>
                                <span class="inline-block whitespace-nowrap text-sm">
                                    <strong class="text-indigo-700">Tel:</strong>
                                    <a
                                        href="`https://wa.me/+51${apoderadoSelec.telefono}`"
                                        target="_blank"
                                        rel="noopener"
                                        style="margin-left: 1rem"
                                        class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 ml-1"
                                    >
                                        <i class="pi pi-whatsapp"></i> {{ apoderadoSelec.telefono }}
                                    </a>
                                </span>
                            </div>
                            <div class="shrink-0">
                                Ultimo Registro:
                                <div class="etiqueta-grado bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                                    <span>{{ apoderadoSelec.ultiAsistencia }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <!-- motivo-->
                    <div class="flex flex-wrap gap-2 w-full" style="margin-top: 0.5rem">
                        <label for="telefono">Motivo de la Consulta</label>
                        <Textarea v-model="motivo" placeholder="Describe brevemente el motivo principal de la atención..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                    <!-- resumen -->
                    <div class="flex flex-wrap gap-2 w-full" style="margin-top: 1rem">
                        <label for="telefono">Resumen de la Sesión</label>
                        <Textarea v-model="resumen" placeholder="Resumen de lo observado y trabajado durante la sesión..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                </div>
            </div>
            <div v-else-if="activeStep === 1">
                <div class="card-border-info horario">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="bi bi-file-check" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Evaluación</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Completa la evaluación profesional</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                        <!-- Conclusion -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="tipoDoc">Conclusiones</label>
                            <Textarea v-model="conclusion" placeholder="Conclusiones profesionales basadas en la evaluación..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                        <!-- Recomendaciones -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="numeroDoc">Recomendaciones</label>
                            <Textarea v-model="recomendacion" placeholder="Recomendaciones específicas para el seguimiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                        <!-- intervencion -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="tipoDoc">Intervención</label>
                            <Textarea v-model="intervenciones" placeholder="Detalla las intervenciones que se han dado..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                        <!-- comentario -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="numeroDoc">Comentarios Adicionales</label>
                            <Textarea v-model="comentario" placeholder="Comentarios adicionales, observaciones del comportamiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- footer -->
        <template #footer>
            <Button label="Cancelar" text @click="cerrarDialogo" />
            <Button label="Anterior" text @click="pasoAnterior" :disabled="activeStep === 0" />
            <Button v-if="activeStep < steps.length - 1" label="Siguiente" text @click="siguientePaso" />
            <Button v-if="activeStep === steps.length - 1" label="Guardar" @click="registrarAtencion" />
        </template>
    </Dialog>
</template>
