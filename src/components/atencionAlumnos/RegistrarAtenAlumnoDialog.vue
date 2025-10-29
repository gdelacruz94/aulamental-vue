<script setup>
import { useAlumnoDetalle } from '@/composables/useAlumno/useAlumnoDetalle';
import { useAlumnosSelect } from '@/composables/useAlumno/useAlumnosSelect';
import { useRegistrarAtencionAlumno } from '@/composables/useAtenAlumno/useRegistrarAtencionAlumno';
import { useDiagnosticoSelect } from '@/composables/useDiagnostico/useDiagnosticoSelect';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    visible: Boolean
});

const toast = useToast();
const emit = defineEmits(['update:visible', 'save']);
const { sugerencias, cargando, buscarAlumnos } = useAlumnosSelect();
const { sugerenciasDiag, cargandoDiag, buscarDiagnostico } = useDiagnosticoSelect();
const { guardarAtencion } = useRegistrarAtencionAlumno();

const idUsuario = parseInt(localStorage.getItem('id'));
const diagnosticoSelecci = ref(null);
const alumnoSeleccionado = ref(null);
const motivo = ref(null);
const resumen = ref(null);
const conclusion = ref(null);
const tecnicas = ref(null);
const recomendacion = ref(null);
const comentario = ref(null);

const { detalle, cargarDetalle } = useAlumnoDetalle();

const activeStep = ref(0);

const steps = [{ label: 'Registro Inicial' }, { label: 'Evaluación y Diagnóstico' }];

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

function resetFormulario() {
    diagnosticoSelecci.value = null;
    alumnoSeleccionado.value = null;
    motivo.value = null;
    resumen.value = null;
    conclusion.value = null;
    tecnicas.value = null;
    recomendacion.value = null;
    comentario.value = null;
    activeStep.value = 0;
}

const pasoActual = computed(() => `Paso ${activeStep.value + 1} de ${steps.length}: ${steps[activeStep.value].label}`);

function siguientePaso() {
    if (activeStep.value === 0) {
        if (!alumnoSeleccionado.value || !motivo.value || !resumen.value) {
            toast.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Selecciona un alumno y completa el motivo y el resumen para continuar.',
                life: 3000
            });
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

watch(alumnoSeleccionado, async (nuevo) => {
    if (nuevo?.id) {
        await cargarDetalle(nuevo.id);
    }
});

async function registrar() {
    if (!conclusion.value || !tecnicas.value || !recomendacion.value || !comentario.value || !diagnosticoSelecci.value) {
        toast.add({
            severity: 'warn',
            summary: 'Campos requeridos',
            detail: 'Completa todos los campos del paso 2 antes de guardar.',
            life: 3000
        });
        return;
    }

    const exito = await guardarAtencion({
        idAlumno: alumnoSeleccionado.value?.id,
        idUsuario,
        motivo: motivo.value,
        resumen: resumen.value,
        conclusion: conclusion.value,
        recomendacion: recomendacion.value,
        tecnicas: tecnicas.value,
        comentario: comentario.value,
        idDiagnostico: diagnosticoSelecci.value?.id
    });

    if (exito) {
        emit('save');
        cerrarDialogo();
    }
}
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
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Selecciona el alumno y describe el motivo de la atención</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="telefono">Seleccionar Estudiante</label>
                        <AutoComplete
                            v-model="alumnoSeleccionado"
                            :suggestions="sugerencias"
                            optionLabel="nombreCompleto"
                            dropdown
                            placeholder="Buscar alumno..."
                            class="w-full"
                            :minLength="1"
                            :forceSelection="true"
                            @complete="buscarAlumnos"
                            @focus="buscarAlumnos({ query: '' })"
                            :panelClass="'shadow-lg rounded-lg'"
                            inputClass="rounded-md"
                        >
                            <template #option="{ option }">
                                <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors cursor-pointer">
                                    <i class="pi pi-user text-blue-600 dark:text-blue-400"></i>
                                    <div class="flex flex-col leading-tight">
                                        <span class="font-medium text-gray-800 dark:text-gray-200">
                                            {{ option.nombreCompleto }}
                                        </span>
                                        <small class="text-gray-500 dark:text-gray-400">
                                            {{ option.nivelSeccion }}
                                        </small>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div v-if="alumnoSeleccionado" class="card-border-retangular mt-4">
                        <div class="flex justify-between items-center text-sm gap-4 flex-wrap">
                            <div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
                                <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Cantidad de Atenciones:</strong> {{ detalle.cantAsistencia }}</span>
                                <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Edad:</strong> {{ detalle.edad }} años</span>
                                <span class="inline-block whitespace-nowrap text-sm">
                                    <strong class="text-indigo-700">Tel:</strong>
                                    <a
                                        v-if="detalle.contact1"
                                        :href="`https://wa.me/+51${detalle.contact1}`"
                                        target="_blank"
                                        rel="noopener"
                                        style="margin-left: 1rem"
                                        class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 ml-1"
                                    >
                                        <i class="pi pi-whatsapp"></i> {{ detalle.contact1 }}
                                    </a>
                                    <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                                </span>
                            </div>
                            <div class="shrink-0">
                                <div class="etiqueta-grado" :class="{ 'bg-inicial': detalle.nivel?.includes('Inicial'), 'bg-primaria': detalle.nivel?.includes('Primaria'), 'bg-secundaria': detalle.nivel?.includes('Secundaria') }">
                                    <span>{{ detalle.nivel }}</span>
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
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Evaluación y Diagnóstico</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Completa la evaluación profesional y establece el diagnóstico</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                        <!-- Conclusion -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="tipoDoc">Conclusión</label>
                            <Textarea v-model="conclusion" placeholder="Conclusiones profesionales basadas en la evaluación....." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                        <!-- Tenicas Utilizadas -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="numeroDoc">Técnicas Utilizadas</label>
                            <Textarea v-model="tecnicas" placeholder="Detalla las técnicas, tests y herramientas utilizadas..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                        <!-- recomendaciones -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="tipoDoc">Recomendaciones</label>
                            <Textarea v-model="recomendacion" placeholder="Recomendaciones específicas para el seguimiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                        <!-- comentarios -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="numeroDoc">Comentarios Adicionales</label>
                            <Textarea v-model="comentario" placeholder="Comentarios adicionales, observaciones del comportamiento...." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                        </div>
                    </div>
                    <div class="flex flex-col w-full md:w-2/2 mt-6" style="margin-top: 1.5rem">
                        <!-- Diagnostico -->
                        <label class="mb-2" for="tipoDoc">Diagnostico</label>
                        <AutoComplete
                            v-model="diagnosticoSelecci"
                            :suggestions="sugerenciasDiag"
                            optionLabel="nombre"
                            dropdown
                            placeholder="Buscar Diagnostico..."
                            class="w-full"
                            :minLength="1"
                            :forceSelection="true"
                            @complete="buscarDiagnostico"
                            @focus="buscarDiagnostico({ query: '' })"
                            :panelClass="'shadow-lg rounded-lg'"
                            inputClass="rounded-md"
                        >
                            <template #option="{ option }">
                                <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors cursor-pointer w-[73vw] md:w-[65vw] lg:w-[55vw] xl:w-[20vw]">
                                    <i class="bi bi-postcard-heart text-blue-600 dark:text-blue-400"></i>
                                    <div class="flex flex-col leading-tight">
                                        <span class="font-medium text-gray-800 dark:text-gray-200">
                                            {{ option.nombre }}
                                        </span>
                                        <small class="text-gray-500 dark:text-gray-400">
                                            {{ option.descripcion }}
                                        </small>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                </div>
            </div>
        </div>
        <!-- footer -->
        <template #footer>
            <Button label="Cancelar" text @click="cerrarDialogo" />
            <Button label="Anterior" text @click="pasoAnterior" :disabled="activeStep === 0" />
            <Button v-if="activeStep < steps.length - 1" label="Siguiente" text @click="siguientePaso" />
            <Button v-if="activeStep === steps.length - 1" label="Guardar" @click="registrar" />
        </template>
    </Dialog>
</template>
