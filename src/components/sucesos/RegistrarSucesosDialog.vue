<script setup>
import { useAlumnosSelect } from '@/composables/useAlumno/useAlumnosSelect';
import SucesoService from '@/service/SucesoService';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible']);
const toast = useToast();
const { sugerencias, cargando, buscarAlumnos } = useAlumnosSelect();
const alumnoSeleccionado = ref(null);
const motivo = ref('');
const mostrarModalSecundario = ref(false);
const estudiantesSeleccionados = ref([]);
const mostrarDialogoEditar = ref(false);
const estudianteEnEdicion = ref(null);
const motivoEditado = ref('');
const nombreIncidente = ref('');
const gravedadNivel = ref(null);
const detalleIncidente = ref('');
const argumentoAlumno = ref('');
const accionesTomadas = ref('');
const idUsuario = Number(localStorage.getItem('id'));

const activeStep = ref(0);

const steps = [{ label: 'Seleccionar estudiantes' }, { label: 'Detalle del suceso' }];

const nivelesGravedad = [
    { label: 'Alta', value: 'ALTA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Baja', value: 'BAJA' }
];

function cerrarModalSecundario() {
    mostrarModalSecundario.value = false;
}

function abrirModalSecundario() {
    alumnoSeleccionado.value = null;
    motivo.value = '';
    mostrarModalSecundario.value = true;
}

function abrirEditarMotivo(est) {
    estudianteEnEdicion.value = est;
    motivoEditado.value = est.motivo;
    mostrarDialogoEditar.value = true;
}

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

function resetFormulario() {
    alumnoSeleccionado.value = null;
    motivo.value = '';
    estudiantesSeleccionados.value = [];
    activeStep.value = 0;
    nombreIncidente.value = ref('');
    gravedadNivel.value = ref(null);
    detalleIncidente.value = ref('');
    argumentoAlumno.value = ref('');
    accionesTomadas.value = ref('');
}

const pasoActual = computed(() => `Paso ${activeStep.value + 1} de ${steps.length}: ${steps[activeStep.value].label}`);

function siguientePaso() {
    if (activeStep.value === 0 && estudiantesSeleccionados.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Lista vacía',
            detail: 'Agrega al menos un estudiante antes de continuar.',
            life: 2500
        });
        return;
    }

    if (activeStep.value < steps.length - 1) {
        activeStep.value++;
    }
}

function pasoAnterior() {
    if (activeStep.value > 0) activeStep.value--;
}

function aceptarSeleccion() {
    if (!alumnoSeleccionado.value || typeof alumnoSeleccionado.value !== 'object' || !alumnoSeleccionado.value.id || !motivo.value.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Selección inválida',
            detail: 'Selecciona un estudiante válido desde la lista y escribe el motivo.',
            life: 3000
        });
        return;
    }

    const yaExiste = estudiantesSeleccionados.value.some((e) => e.id === alumnoSeleccionado.value.id);
    if (yaExiste) {
        toast.add({
            severity: 'info',
            summary: 'Duplicado',
            detail: 'Ese estudiante ya está en la lista.',
            life: 3000
        });
        return;
    }

    estudiantesSeleccionados.value.push({
        ...alumnoSeleccionado.value,
        motivo: motivo.value.trim()
    });

    toast.add({
        severity: 'success',
        summary: 'Añadido',
        detail: `${alumnoSeleccionado.value.nombreCompleto} agregado a la lista.`,
        life: 2000
    });

    cerrarModalSecundario();
}

function guardarMotivo() {
    if (!motivoEditado.value.trim()) return;

    estudianteEnEdicion.value.motivo = motivoEditado.value.trim();

    toast.add({
        severity: 'success',
        summary: 'Motivo actualizado',
        detail: `Se actualizó el motivo de ${estudianteEnEdicion.value.nombreCompleto}.`,
        life: 2000
    });

    mostrarDialogoEditar.value = false;
}

function eliminarEstudiante(est) {
    estudiantesSeleccionados.value = estudiantesSeleccionados.value.filter((e) => e.id !== est.id);

    toast.add({
        severity: 'info',
        summary: 'Eliminado',
        detail: `${est.nombreCompleto} fue quitado de la lista.`,
        life: 2000
    });
}

async function guardarSuceso() {
    if (!nombreIncidente.value.trim() || !gravedadNivel.value || !detalleIncidente.value.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Campos requeridos',
            detail: 'Completa nombre, gravedad y detalles del suceso.',
            life: 2500
        });
        return;
    }

    const payload = {
        idUsuario,
        nombre: nombreIncidente.value.trim(),
        detalles: detalleIncidente.value.trim(),
        argurmentosAlumno: argumentoAlumno.value.trim(),
        accionesRealizadas: accionesTomadas.value.trim(),
        nivelGravedad: gravedadNivel.value,
        alumnoIncidentes: estudiantesSeleccionados.value.map((e) => ({
            idAlumno: e.id,
            motivo: e.motivo
        }))
    };

    try {
        await SucesoService.createSuceso(payload);
        toast.add({
            severity: 'success',
            summary: 'Suceso registrado',
            detail: 'Se guardó correctamente.',
            life: 2500
        });
        cerrarDialogo();
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'No se pudo guardar.',
            life: 3000
        });
    }
}

watch(
    () => props.visible,
    (abierto) => {
        if (abierto) resetFormulario();
    }
);
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="(val) => emit('update:visible', val)"
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
                <span class="titulo-registrar">Registrar Nuevo Suceso</span>
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
                            <i class="pi pi-users" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Selecciona los alumnos involucrados</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Selecciona estudiantes del listado y agrega el motivo específico para cada uno</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <DataTable :value="estudiantesSeleccionados">
                        <template #header>
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                                <h4 class="m-0">Estudiantes Seleccionados</h4>
                                <Button label="Buscar estudiantes" icon="pi pi-search" class="p-button" @click="abrirModalSecundario" />
                            </div>
                        </template>
                        <Column field="id" header="Code" style="min-width: 1rem" />
                        <Column field="nombreCompleto" header="Nombre Completo" style="min-width: 10rem" />
                        <Column header="Nivel/Seccion" style="min-width: 9rem">
                            <template #body="slotProps">
                                <div class="etiqueta-grado" style="">
                                    <span> {{ slotProps.data.nivelSeccion }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="motivo" header="Motivo" style="min-width: 15rem" />
                        <Column header="Acciones" style="min-width: 4rem">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" text rounded severity="info" @click="abrirEditarMotivo(slotProps.data)" />

                                <Button icon="pi pi-trash" text rounded severity="danger" @click="eliminarEstudiante(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
            <div v-else-if="activeStep === 1">
                <div class="card-border-info horario">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="bi bi-file-earmark-fill" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Detalles del Suceso</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Complete la información detallada sobre el suceso ocurrido</p>
                        </div>
                    </div>
                </div>

                <div class="card-border">
                    <div class="p-fluid grid gap-3">
                        <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                            <!-- Nombre del suceso -->
                            <div class="flex flex-col w-full md:w-1/2">
                                <label class="mb-2" for="tipoDoc">Nombre del Suceso</label>
                                <InputText id="nombre" v-model="nombreIncidente" placeholder="Ej: Suceso durante la clase" />
                            </div>
                            <!-- Nivel de gravedad -->
                            <div class="flex flex-col w-full md:w-1/2">
                                <label class="mb-2" for="numeroDoc">Nivel de Gravedad</label>
                                <Select v-model="gravedadNivel" :options="nivelesGravedad" optionLabel="label" optionValue="value" placeholder="Selecciona el nivel" class="w-full" />
                            </div>
                        </div>
                        <!-- Detalles del suceso -->
                        <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1rem">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="telefono">Detalles del Suceso </label>
                                <Textarea id="detalle" v-model="detalleIncidente" placeholder="Describe detalladamente lo ocurrido…" rows="4" autoResize class="w-full" />
                            </div>
                        </div>
                        <!-- Argumentos del Alumno -->
                        <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1rem">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="telefono">Argumentos del Alumno</label>
                                <Textarea id="argumento" v-model="argumentoAlumno" placeholder="Argumentos o explicación del alumno…" rows="4" autoResize class="w-full" />
                            </div>
                        </div>
                        <!-- Acciones Realizadas -->
                        <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1rem">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="telefono">Acciones Realizadas</label>
                                <Textarea id="acciones" v-model="accionesTomadas" placeholder="Describe las acciones tomadas…" rows="4" autoResize class="w-full" />
                            </div>
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
            <Button v-else label="Guardar" @click="guardarSuceso" icon="pi pi-check" />
        </template>
    </Dialog>
    <!--Dialog de seleccion de usuario-->
    <Dialog v-model:visible="mostrarModalSecundario" class="modal-personalizado" modal header="Buscar estudiantes" :style="{ width: '93vw', maxWidth: '50rem' }" @update:visible="(val) => (mostrarModalSecundario = val)">
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
            <div class="flex flex-wrap gap-2 w-full" style="margin-top: 1.5rem">
                <label for="telefono">Motivo </label>
                <Textarea v-model="motivo" :autoResize="true" rows="5" cols="30" style="width: 100%" />
            </div>
        </div>
        <template #footer>
            <Button label="Cerrar" text @click="cerrarModalSecundario" />
            <Button label="Aceptar" icon="pi pi-check" @click="aceptarSeleccion" />
        </template>
    </Dialog>
    <!-- Dialog de editar motivo-->
    <Dialog v-model:visible="mostrarDialogoEditar" class="modal-personalizado" header="Editar motivo" modal :style="{ width: '28rem' }">
        <div class="card-border">
            <label>Motivo</label>
            <Textarea v-model="motivoEditado" :autoResize="true" rows="5" style="width: 100%; margin-top: 1rem" />
        </div>

        <template #footer>
            <Button label="Cancelar" text @click="mostrarDialogoEditar = false" />
            <Button label="Actualizar" icon="pi pi-check" @click="guardarMotivo" :disabled="!motivoEditado.trim()" />
        </template>
    </Dialog>
</template>
