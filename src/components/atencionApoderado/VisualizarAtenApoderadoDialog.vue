<script setup>
import { useatenapoderadoHistoria } from '@/composables/useAtenApoderado/useAtenApoderadoHistorial';
import { getDetalleAtencionApoderado } from '@/service/AtencionApoderadosService';
import { descargarPdfAtencionApoderado } from '@/service/ExportarService';
import { defineProps, ref, watch } from 'vue';

const props = defineProps({ visible: Boolean, idUsuario: Number, nombre: String, fecha: String, telefono: String, total: Number });
const emit = defineEmits(['update:visible']);

const mostrarDetalle = ref(false);
const atencionId = ref(null);

const motivo = ref(null);
const comentarios = ref(null);
const resumen = ref(null);
const conclusiones = ref(null);
const recomendaciones = ref(null);
const intervencion = ref(null);
const fecha = ref(null);

const fechaFiltro = ref(null);
const tabla = ref(null);

watch(
    () => props.visible,
    async (open) => {
        if (open && props.idUsuario) {
            fechaFiltro.value = null;

            tabla.value = useatenapoderadoHistoria(props.idUsuario, fechaFiltro);

            await tabla.value.lazyLoad();
        }
    }
);

watch(fechaFiltro, async () => {
    if (tabla.value) {
        await tabla.value.lazyLoad();
    }
});

async function descargarAtencionApoderado(idAtencion) {
    await descargarPdfAtencionApoderado(idAtencion, props.idUsuario);
}

async function abrirDetalleAtencion(id) {
    try {
        const res = await getDetalleAtencionApoderado(id);
        const data = res.data;
        atencionId.vale = id;
        motivo.value = data.motivo;
        resumen.value = data.resumen;
        conclusiones.value = data.conclusiones;
        recomendaciones.value = data.recomendaciones;
        intervencion.value = data.intervencion;
        comentarios.value = data.comentario;
        fecha.value = data.fecha;
        mostrarDetalle.value = true;
    } catch (error) {
        console.error('Error al cargar detalle del suceso:', error);
    }
}

function cerrarDialogo() {
    emit('update:visible', false);
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        class="modal-personalizado"
        :style="{ maxWidth: '80rem', width: '76vw' }"
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
                    <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion-info">
                        <i class="bi bi-calendar" style="font-size: 1.4rem"></i>
                    </div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-gray-900 dark:text-surface-0" style="font-size: 1.3rem">Atenciones de {{ props.nombre }}</span>
                    </div>
                </div>
            </div>
        </template>
        <!-- Contenedor general limpio -->
        <div class="w-full">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 w-full">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border-t-4 border-blue-500 p-5 text-center w-full">
                    <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ props.total }}</p>
                    <p class="text-gray-500 dark:text-gray-300 mt-2" style="font-size: 1.1rem">Total Atenciones</p>
                </div>

                <!-- Años -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border-t-4 border-green-500 p-5 text-center w-full">
                    <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ props.telefono }}</p>
                    <p class="text-gray-500 dark:text-gray-300 mt-2" style="font-size: 1.1rem">Telefono Principal</p>
                </div>

                <!-- Nivel -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border-t-4 border-purple-500 p-5 text-center w-full">
                    <p class="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{{ props.fecha }}</p>
                    <p class="text-gray-500 dark:text-gray-300 mt-2" style="font-size: 1.1rem">Ultima Atencion</p>
                </div>
            </div>
        </div>
        <div class="card-border" style="margin-top: 1rem; margin-bottom: 1rem">
            <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
                <div class="flex align-items-center gap-2">
                    <i class="bi bi-folder-fill" style="font-size: 1.55rem"></i>
                    <h4 class="m-0">Historial de Atencion</h4>
                </div>
                <DatePicker v-model="fechaFiltro" placeholder="Selecciona fecha" class="w-12rem" />
            </div>
            <p v-if="tabla?.data?.length === 0" class="text-center my-4 text-gray-500" style="margin-top: 1rem">No hay registros de asistencia para la fecha seleccionada</p>

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
                <Column field="fecha" header="Fecha" style="min-width: 1rem" />
                <Column field="motivo" header="Motivo" style="min-width: 28rem" />
                <Column header="Accion" style="min-width: 3rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button icon="bi bi-file-earmark-text-fill" style="font-size: 1.3rem" text severity="info" @click="abrirDetalleAtencion(slotProps.data.id)" />
                            <Button icon="bi bi-filetype-pdf" style="font-size: 1.3rem" text severity="help" @click="descargarAtencionApoderado(slotProps.data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <template #footer>
            <Button label="Cerrar" outlined @click="cerrarDialogo" />
        </template>
    </Dialog>
    <!-- Dialog de detalle-->
    <Dialog v-model:visible="mostrarDetalle" modal :style="{ width: '60rem' }">
        <template #header>
            <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                <i class="bi bi-file-earmark-text text-blue-600 dark:text-blue-700" style="font-size: 1.2rem"></i>
                <span class="font-semibold text-blue-600 dark:text-blue-700" style="font-size: 1.1rem; margin-left: 0.5rem">Detalle de Atencion - {{ props.nombre }}</span>
            </div>
        </template>
        <!-- Información Fecha -->
        <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-sm rounded-md px-4 py-2">
            <span class="text-blue-700 dark:text-blue-300" style="font-size: 1rem">Fecha de Atención:</span>
            <span class="font-bold text-blue-700 dark:text-blue-100" style="margin-left: 0.5rem">{{ fecha }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" style="margin-top: 1rem">
            <!-- Información General -->
            <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información General</h2>

                <div class="mb-3">
                    <strong class="text-gray-700 dark:text-gray-300">Motivo:</strong>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">{{ motivo }}</p>
                </div>

                <div>
                    <strong class="text-gray-700 dark:text-gray-300">Resumen de la Sesión:</strong>
                    <div class="mt-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500 px-3 py-2 rounded overflow-auto max-h-32">
                        {{ resumen }}
                    </div>
                </div>
            </div>

            <!-- Técnicas y Metodología -->
            <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Intervencion y Metodología</h2>

                <div class="mb-3">
                    <strong class="text-gray-700 dark:text-gray-300">Intervencion: </strong>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">
                        {{ intervencion }}
                    </p>
                </div>

                <div>
                    <strong class="text-gray-700 dark:text-gray-300">Comentarios del Profesional:</strong>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">
                        {{ comentarios }}
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
                    {{ conclusiones }}
                </div>
            </div>

            <!-- Recomendaciones -->
            <div class="mb-4">
                <p class="font-semibold text-gray-800 dark:text-white">Recomendaciones:</p>
                <div class="mt-1 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                    {{ recomendaciones }}
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cerrar" @click="mostrarDetalle = false" />
        </template>
    </Dialog>
</template>
