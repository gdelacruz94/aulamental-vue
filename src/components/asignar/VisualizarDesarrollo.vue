<script setup>
import { useAprobarPracticante } from '@/composables/useAsignar/useAprobarPracticante';
import { useAsignarlistTaskPracticante } from '@/composables/useAsignar/useAsignarListTaskPracticante';
import { useAsignacionPracticantesStast } from '@/composables/useAsignar/useAsignarPracticanteDetails';
import { useRechazoPracticante } from '@/composables/useAsignar/useRechazoPracticante';
import { getDetalleAtencionAlumno } from '@/service/AtencionAlumnoService';

import { getDetalleAtencionApoderado } from '@/service/AtencionApoderadosService';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';

const emit = defineEmits(['update:visible', 'save']);

const props = defineProps({
    visible: Boolean,
    id: Number,
    nombre: String
});

const visibleLocal = ref(false);
const detalle = ref(null);
const cargando = ref(false);
const showViewDialog = ref(false);
const showObservacionDialog = ref(false);
const observacion = ref('');
const toast = useToast();
const { total, pendiente, enviado, revicion, completando, cargar } = useAsignacionPracticantesStast();
const tabla = ref(null);
const selectTDocumento = ref(null);
const selectidDocumento = ref(null);
const selectfecha = ref(null);
const selectStatus = ref(null);
const selectIDAsignacion = ref(null);

const tipoMapeo = {
    ATENCIONALUMNO: 'Atención Alumno',
    ATENCIONAPODERADO: 'Atención Apoderado'
};

function formatearTitulo(tipo) {
    return tipoMapeo[tipo] || tipo;
}

function abrirViewDialog(idDocumento, tDocumento, fechaS, statusS, idAsignacion) {
    selectTDocumento.value = tDocumento;
    selectidDocumento.value = idDocumento;
    selectfecha.value = fechaS;
    selectStatus.value = statusS;
    selectIDAsignacion.value = idAsignacion;
    cargarDetalle();
    showViewDialog.value = true;
}

function abrirObservacionDialogo() {
    observacion.value = '';
    showObservacionDialog.value = true;
}

function CerrarObservacionDialogo() {
    observacion.value = '';
    showObservacionDialog.value = false;
}

watch(
    () => props.visible,
    async (val) => {
        visibleLocal.value = val;

        if (val && props.id) {
            cargar(props.id);
            tabla.value = useAsignarlistTaskPracticante(props.id);
        }
    }
);

watch(visibleLocal, (val) => {
    emit('update:visible', val);
});

function cerrarViewDialog() {
    cargar(props.id);
    tabla.value = useAsignarlistTaskPracticante(props.id);
    showViewDialog.value = false;
}

function cerrarDialogo() {
    emit('update:visible', false);
}

async function cargarDetalle() {
    detalle.value = null;

    try {
        if (selectTDocumento.value === 'ATENCIONALUMNO') {
            const res = await getDetalleAtencionAlumno(selectidDocumento.value);
            detalle.value = res.data;
        } else if (selectTDocumento.value === 'ATENCIONAPODERADO') {
            const res = await getDetalleAtencionApoderado(selectidDocumento.value);
            detalle.value = res.data;
        } else {
            console.warn('Tipo de documentacion desconocido:', selectTDocumento.value);
        }
    } catch (error) {
        console.error('Error al cargar detalle:', error);
    }
}

const { enviarRechazo } = useRechazoPracticante();

async function enviarObservacion() {
    if (!observacion.value.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Observación requerida',
            detail: 'Escribe la observación antes de enviar.',
            life: 4000
        });
        return;
    }

    try {
        const ok = await enviarRechazo(selectIDAsignacion.value, observacion.value);
        if (ok) {
            toast.add({
                severity: 'success',
                summary: 'Observación enviada',
                detail: 'La observación fue registrada correctamente.',
                life: 4000
            });
            CerrarObservacionDialogo();
            cerrarViewDialog();
            cargar(props.id);
            tabla.value = useAsignarlistTaskPracticante(props.id);
            emit('save');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error al enviar',
                detail: 'Intenta nuevamente.',
                life: 4000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error al enviar',
            detail: 'Verifica tu conexión o intenta más tarde.',
            life: 4000
        });
    }
}

const { aprobarInforme } = useAprobarPracticante();

async function aprobar() {
    try {
        const ok = await aprobarInforme(selectIDAsignacion.value);
        if (ok) {
            toast.add({
                severity: 'success',
                summary: 'Informe Aprobado',
                detail: 'El informe fue aprobado correctamente.',
                life: 4000
            });
            cerrarViewDialog();
            emit('save');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error al aprobar',
                detail: 'Intenta nuevamente.',
                life: 4000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error inesperado',
            detail: 'Verifica tu conexión o intenta más tarde.',
            life: 4000
        });
    }
}
</script>

<template>
    <!-- primer modal-->
    <Dialog
        v-model:visible="visibleLocal"
        modal
        :style="{ maxWidth: '60rem', width: '76vw' }"
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
                    <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion"><i class="pi pi-user" style="font-size: 1.7rem" /></div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-gray-900 dark:text-surface-0" style="font-size: 1.3rem">Registro de Tareas</span>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-600 dark:text-surface-0" style="font-size: 0.9rem">Practicante: {{ props.nombre }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-wrap gap-3 justify-content-center">
            <!-- Presente -->
            <div class="card-asistencia-visual presente-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Enviados</span>
                    <span class="asistencia-visual-cantidad">{{ enviado }}</span>
                </div>
                <span class="asistencia-visual-icon-circle presente-card-icon">
                    <i class="bi bi-check-lg" style="font-size: 1.2rem"></i>
                </span>
            </div>
            <!-- Tardanza -->
            <div class="card-asistencia-visual falta-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Pendientes</span>
                    <span class="asistencia-visual-cantidad">{{ pendiente }}</span>
                </div>
                <span class="asistencia-visual-icon-circle falta-card-icon">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.1rem"></i>
                </span>
            </div>
            <!-- Falta -->
            <div class="card-asistencia-visual tarde-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">En Revision</span>
                    <span class="asistencia-visual-cantidad">{{ revicion }}</span>
                </div>
                <span class="asistencia-visual-icon-circle tarde-card-icon">
                    <i class="bi bi-x" style="font-size: 1.1rem"></i>
                </span>
            </div>
        </div>

        <div class="card-border" style="margin-top: 1rem">
            <p v-if="tabla?.data?.length === 0" class="text-center my-4 text-gray-500">No hay Tareas Asignadas al Practicante</p>
            <DataTable
                v-if="tabla?.data?.length > 0"
                :value="tabla.data"
                :lazy="true"
                :paginator="true"
                :rows="5"
                :first="tabla.lazyParams.page * tabla.lazyParams.rows"
                :totalRecords="tabla.totalRecords"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                @page="tabla.onPage"
            >
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="fecha" header="Fecha" style="min-width: 8rem" />
                <Column header="Tipo Documento" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <i class="bi bi-file-earmark-text text-blue-600 dark:text-blue-400" style="font-size: 1.1rem"></i>
                            <span class="text-gray-800 dark:text-gray-200">
                                {{ formatearTitulo(data.tipodocumentacion) }}
                            </span>
                        </div>
                    </template>
                </Column>
                <Column header="Estado" style="min-width: 8rem">
                    <template #body="slotProps">
                        <div
                            class="etiqueta-grado"
                            :class="{
                                'bg-pendiente': slotProps.data.estadoDocumento.includes('PENDIENTE'),
                                'bg-enviado': slotProps.data.estadoDocumento.includes('ENVIADO'),
                                'bg-revisado': slotProps.data.estadoDocumento.includes('REVISADO'),
                                'bg-cerrado': slotProps.data.estadoDocumento.includes('CERRADO')
                            }"
                        >
                            <span> {{ slotProps.data.estadoDocumento }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Accion" style="min-width: 3rem">
                    <template #body="slotProps">
                        <Button
                            icon="bi bi-file-earmark-text-fill"
                            style="font-size: 1.3rem"
                            text
                            severity="info"
                            @click="abrirViewDialog(slotProps.data.idDocumento, slotProps.data.tipodocumentacion, slotProps.data.fecha, slotProps.data.estadoDocumento, slotProps.data.id)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>
        <template #footer>
            <Button label="Cerrar" severity="secondary" outlined class="flex-1 md:flex-none dark:border-gray-500 dark:text-gray-200" @click="cerrarDialogo" />
        </template>
    </Dialog>
    <!-- seundo modal-->
    <Dialog
        v-model:visible="showViewDialog"
        modal
        :style="{ maxWidth: '60rem', width: '76vw' }"
        :breakpoints="{
            '1199px': '75vw',
            '991px': '85vw',
            '767px': '95vw',
            '575px': '98vw'
        }"
    >
        <template #header>
            <div class="inline-flex items-center gap-3 text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold">
                <i class="bi bi-file-earmark-text"></i>
                <span>Visualizar Informe - {{ props.nombre }}</span>
            </div>
        </template>
        <!-- CABEZERA PRINCIPAL -->
        <div class="px-5 py-3 rounded-lg border shadow-sm bg-primary-50 dark:bg-surface-800 border-primary-100 dark:border-surface-700 text-primary dark:text-white text-sm md:text-base">
            <div class="grid grid-cols-2 gap-y-2 gap-x-6">
                <div>
                    <span class="font-bold">Paciente:</span> <span v-if="detalle" class="font-normal">{{ detalle.nombre }}</span>
                </div>
                <div class="text-right">
                    <span class="font-bold">Tipo:</span> <span class="font-normal">{{ formatearTitulo(selectTDocumento) }}</span>
                </div>
                <div>
                    <span class="font-bold">Estado:</span> <span class="font-normal">{{ selectStatus }}</span>
                </div>
                <div class="text-right">
                    <span class="font-bold">Fecha:</span> <span class="font-normal">{{ selectfecha }}</span>
                </div>
            </div>
        </div>

        <!-- ATENCION ALUMNO  -->

        <div v-if="selectTDocumento === 'ATENCIONALUMNO' && detalle" style="margin-top: 1rem">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Información General -->
                <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                    <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información General</h2>

                    <div class="mb-3">
                        <strong class="text-gray-700 dark:text-gray-300">Motivo:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ detalle.motivo }}</p>
                    </div>

                    <div>
                        <strong class="text-gray-700 dark:text-gray-300">Diagnóstico:</strong>
                        <div class="mt-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500 px-3 py-2 rounded overflow-auto max-h-32">
                            {{ detalle.Diagnostico }}
                        </div>
                    </div>
                </div>

                <!-- Técnicas y Metodología -->
                <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                    <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Técnicas y Metodología</h2>

                    <div class="mb-3">
                        <strong class="text-gray-700 dark:text-gray-300">Técnicas Utilizadas:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            {{ detalle.tecnicas }}
                        </p>
                    </div>

                    <div>
                        <strong class="text-gray-700 dark:text-gray-300">Comentarios del Profesional:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            {{ detalle.comentario }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-surface-900 p-5 rounded-lg shadow border border-gray-200 dark:border-surface-700" style="margin-top: 1rem">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Análisis y Conclusiones</h3>

                <!-- Resumen de la sesión -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Resumen de la Sesión:</p>
                    <div class="mt-1 bg-blue-50 dark:bg-surface-700 text-gray-700 dark:text-surface-100 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ detalle.resumen }}
                    </div>
                </div>

                <!-- Conclusión Profesional -->

                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Conclusión Profesional:</p>
                    <div class="mt-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ detalle.conclusion }}
                    </div>
                </div>

                <!-- Recomendaciones -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Recomendaciones:</p>
                    <div class="mt-1 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ detalle.recomendacion }}
                    </div>
                </div>
            </div>
        </div>

        <!-- ATENCION APODERADO -->

        <div v-else-if="selectTDocumento === 'ATENCIONAPODERADO' && detalle">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" style="margin-top: 1rem">
                <!-- Información General -->
                <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                    <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información General</h2>

                    <div class="mb-3">
                        <strong class="text-gray-700 dark:text-gray-300">Motivo:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ detalle.motivo }}</p>
                    </div>

                    <div>
                        <strong class="text-gray-700 dark:text-gray-300">Resumen de la Sesión:</strong>
                        <div class="mt-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500 px-3 py-2 rounded overflow-auto max-h-32">
                            {{ detalle.resumen }}
                        </div>
                    </div>
                </div>

                <!-- Técnicas y Metodología -->
                <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                    <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Intervencion y Metodología</h2>

                    <div class="mb-3">
                        <strong class="text-gray-700 dark:text-gray-300">Intervencion: </strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            {{ detalle.intervencion }}
                        </p>
                    </div>

                    <div>
                        <strong class="text-gray-700 dark:text-gray-300">Comentarios del Profesional:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            {{ detalle.comentario }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-surface-900 p-5 rounded-lg shadow border border-gray-200 dark:border-surface-700" style="margin-top: 1rem">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Análisis y Conclusiones</h3>

                <!-- Conclusión Profesional -->

                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Conclusión Profesional:</p>
                    <div class="mt-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ detalle.conclusiones }}
                    </div>
                </div>

                <!-- Recomendaciones -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Recomendaciones:</p>
                    <div class="mt-1 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ detalle.recomendaciones }}
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between items-center flex-wrap gap-3 mt-4">
                <!-- Botón Cerrar -->
                <Button label="Cerrar" severity="secondary" outlined class="flex-1 md:flex-none dark:border-gray-500 dark:text-gray-200" @click="cerrarViewDialog" />

                <!-- Botones condicionales -->
                <template v-if="selectStatus === 'REVISADO' || selectStatus === 'ENVIADO'">
                    <!-- Botón Solicitar Revisión -->
                    <Button label="Solicitar Revisión" icon="pi pi-times-circle" severity="danger" outlined class="flex-1 md:flex-none dark:border-red-400 dark:text-red-400" @click="abrirObservacionDialogo" />

                    <!-- Botón Aprobar Informe -->
                    <Button label="Aprobar Informe" icon="pi pi-check-circle" severity="success" class="flex-1 md:flex-none dark:bg-green-600 dark:border-green-600 dark:text-white" @click="aprobar" />
                </template>
            </div>
        </template>
    </Dialog>
    <!--Observacion -->
    <Dialog v-model:visible="showObservacionDialog" modal :style="{ maxWidth: '40rem', width: '76vw' }">
        <template #header>
            <div class="flex items-center gap-2 text-orange-600 hover:text-orange-700 cursor-pointer">
                <i class="bi bi-chat-left" style="font-size: 1.2rem"></i>
                <span class="font-semibold" style="font-size: 1.2rem">Solicitar Revisión</span>
            </div>
        </template>
        <div class="flex items-start gap-4 p-6 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-500">
            <i class="bi bi-chat-left" style="font-size: 1.5rem"></i>
            <div class="flex flex-col">
                <span class="font-semibold">Observaciones para Revisión</span>
                <span class="text-sm opacity-90"> Proporciona comentarios específicos para que el practicante pueda mejorar el informe </span>
            </div>
        </div>
        <div class="flex flex-col gap-1 w-full max-w-xl" style="margin-top: 1rem">
            <!-- Label -->
            <label class="text-sm font-semibold text-gray-800 dark:text-gray-200" style="font-size: 1rem; margin-bottom: 1rem"> Observaciones y Comentarios <span class="text-red-500">*</span> </label>
            <!-- Textarea -->
            <Textarea v-model="observacion" placeholder="Describe las observaciones específicas que el practicante debe considerar para mejorar el informe..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
            <!-- Ayuda -->
            <span class="text-xs text-gray-500 dark:text-gray-400"> Sé específico sobre qué aspectos necesitan mejora para facilitar la revisión. </span>
        </div>
        <template #footer>
            <Button label="Cerrar" icon="pi pi-times" @click="CerrarObservacionDialogo" class="p-button-text" />
            <Button severity="warn" label="Enviar Observaciones" @click="enviarObservacion" />
        </template>
    </Dialog>
</template>
