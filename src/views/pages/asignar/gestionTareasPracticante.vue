<script setup>
import DesarrollarTareaDialog from '@/components/asignar/DesarrollarTareaDialog.vue';
import { useAsignacionPracticantesStast } from '@/composables/useAsignar/useAsignarPracticanteDetails';
import { useAsignacionesPracticante } from '@/composables/useAsignar/useAsignarPracticatelist';

import { onMounted, ref } from 'vue';

const showViewDialog = ref(null);
const fechaFiltro = ref(null);
const tabla = ref(null);

const tipoMapeo = {
    ATENCIONALUMNO: 'Atención Alumno',
    ATENCIONAPODERADO: 'Atención Apoderado'
};

const idSelect = ref(null);
const idDocumentoSelect = ref(null);
const tipodocumentoSelect = ref(null);
const estadoSelect = ref(null);
const fechaSelect = ref(null);
const nombreSelect = ref(null);
const observacionSelect = ref(null);
const { total, pendiente, enviado, revicion, completando, cargar } = useAsignacionPracticantesStast();

function openEdit(id, nombre, tipodocumentacion, idDocumento, estado, fecha, observacion) {
    idDocumentoSelect.value = idDocumento;
    nombreSelect.value = nombre;
    idSelect.value = id;
    tipodocumentoSelect.value = tipodocumentacion;
    estadoSelect.value = estado;
    fechaSelect.value = fecha;
    observacionSelect.value = observacion;
    showViewDialog.value = true;
}

function formatearTitulo(tipo) {
    return tipoMapeo[tipo] || tipo;
}

function obtenerLabelBoton(estado) {
    if (estado.includes('PENDIENTE') || estado.includes('ENVIADO')) {
        return 'Desarrollar';
    }
    if (estado.includes('REVISADO') || estado.includes('EN REVISION') || estado.includes('EN REVISIÓN')) {
        return 'Revisar';
    }
    if (estado.includes('COMPLETADO') || estado.includes('CERRADO')) {
        return 'Completado';
    }
    return 'Acción';
}

onMounted(() => {
    const idUsuario = localStorage.getItem('id');
    cargar(idUsuario);
    tabla.value = useAsignacionesPracticante(idUsuario, fechaFiltro);
});

function recargarAsignarciones() {
    const idUsuario = localStorage.getItem('id');
    cargar(idUsuario);
    tabla.value = useAsignacionesPracticante(idUsuario, fechaFiltro);
}
</script>

<template>
    <div>
        <h2>Panel de Practicante</h2>
        <p class="subtitle">Desarrolla y gestiona tus informes de atención psicológica asignados.</p>
        <!-- card - informacion -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <!-- Total Asignadas (blanco) -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ total }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Total Asignadas</span>
            </div>

            <!-- Pendientes -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-800 dark:text-gray-200">{{ pendiente }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Pendientes</span>
            </div>

            <!-- Enviados -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-blue-600 dark:text-blue-300">{{ enviado }}</span>
                <span class="text-base text-blue-600 dark:text-blue-300 mt-2">Enviados</span>
            </div>

            <!-- En Revisión -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-yellow-300 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-yellow-600 dark:text-yellow-300">{{ revicion }}</span>
                <span class="text-base text-yellow-600 dark:text-yellow-300 mt-2">En Revisión</span>
            </div>

            <!-- Completados -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-green-600 dark:text-green-300">{{ completando }}</span>
                <span class="text-base text-green-600 dark:text-green-300 mt-2">Completados</span>
            </div>
        </div>
        <div class="card" style="margin-top: 1rem">
            <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
                <div class="flex align-items-center gap-2">
                    <i class="bi bi-calendar" style="font-size: 1.55rem"></i>
                    <h4 class="m-0">Historial de Asistencia</h4>
                </div>
                <DatePicker v-model="fechaFiltro" placeholder="Selecciona fecha" class="w-12rem" />
            </div>
            <p v-if="tabla?.data?.length === 0" class="text-center my-4 text-gray-500">No hay registros de asistencia para la fecha seleccionada</p>
            <DataTable
                v-if="tabla?.data?.length > 0"
                :value="tabla.data"
                :lazy="true"
                :paginator="true"
                :rows="10"
                :first="tabla.lazyParams.page * tabla.lazyParams.rows"
                :totalRecords="tabla.totalRecords"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                @page="tabla.onPage"
            >
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="nombre" header="Paciente" style="min-width: 15rem" />
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
                <Column field="fecha" header="Fecha" />
                <Column header="Acciones">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button
                                icon="bi bi-file-earmark-text"
                                :label="obtenerLabelBoton(slotProps.data.estadoDocumento)"
                                outlined
                                severity="info"
                                @click="openEdit(slotProps.data.id, slotProps.data.nombre, slotProps.data.tipodocumentacion, slotProps.data.idDocumento, slotProps.data.estadoDocumento, slotProps.data.fecha, slotProps.data.observacion)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <DesarrollarTareaDialog
            v-model:visible="showViewDialog"
            @save="recargarAsignarciones"
            :id="idSelect"
            :tipodocumentacion="tipodocumentoSelect"
            :idDocumento="idDocumentoSelect"
            :estado="estadoSelect"
            :fecha="fechaSelect"
            :nombre="nombreSelect"
            :observacion="observacionSelect"
        />
    </div>
</template>
