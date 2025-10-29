<script setup>
import { useMensajeria } from '@/composables/useCita/useMensajeria';
import { useSucesosAlumno } from '@/composables/useSuceso/useSucesosAlumno';
import { useSucesosStats } from '@/composables/useSuceso/useSucesosStats';
import { descargarPdfSuceso, descargarPdfSucesos } from '@/service/ExportarService';
import { getDetalleSuceso } from '@/service/SucesoService';
import { computed, ref, toRef, watch } from 'vue';

const props = defineProps({ visible: Boolean, idUsuario: Number, nombre: String, grado: String });
const emit = defineEmits(['update:visible']);

const { alias, baja, media, alta, cargar } = useSucesosStats();
const totalSucesos = computed(() => baja.value + media.value + alta.value);
const idUsuarioRef = toRef(props, 'idUsuario');
const mostrarDetalle = ref(false);
const sucesoSeleccionado = ref(null);
const nombreIncidente = ref('');
const detalleIncidente = ref('');
const argumentoAlumno = ref('');
const accionesTomadas = ref('');
const fecha = ref('');
const openViewCitacion = ref(false);

const today = new Date();
const fechaCita = ref(null);
const hora = ref(null);
const motivo = ref('');
const idAlumno = toRef(props, 'idUsuario');
const idpsicologo = localStorage.getItem('id');
const psicologo = localStorage.getItem('nombre');

function formatTime(date) {
    if (!date) return null;
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

const { dt, data: sucesos, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useSucesosAlumno(idUsuarioRef);

const rolesUsuario = JSON.parse(localStorage.getItem('roles') || '[]');

const esDirectora = computed(() => rolesUsuario.includes('Directora'));

watch(
    () => props.visible,
    (open) => {
        if (open && props.idUsuario) {
            search.value = '';
            cargar(props.idUsuario);
            lazyLoad();
        }
    }
);

async function descargarPDF() {
    await descargarPdfSucesos(props.idUsuario);
}

function descargarSucesoPDF(idSuceso) {
    descargarPdfSuceso(idSuceso, props.idUsuario);
}

async function abrirDetalleSuceso(id) {
    try {
        const res = await getDetalleSuceso(id);
        const data = res.data;

        nombreIncidente.value = data.nombre;
        detalleIncidente.value = data.detalle;
        argumentoAlumno.value = data.argumentos;
        accionesTomadas.value = data.acciones;
        fecha.value = data.fecha;

        sucesoSeleccionado.value = id;
        mostrarDetalle.value = true;
    } catch (error) {
        console.error('Error al cargar detalle del suceso:', error);
    }
}

const { enviarMensajeCitacion, loading } = useMensajeria();

function enviar() {
    const payload = {
        idAlumno: idAlumno.value,
        idpsicologo: Number(idpsicologo),
        psicologo: psicologo,
        fecha: formatDate(fechaCita.value),
        hora: formatTime(hora.value),
        motivo: motivo.value
    };

    enviarMensajeCitacion(payload, () => {
        openViewCitacion.value = false;
    });
}

function openCitacion() {
    fechaCita.value = new Date();
    hora.value = null;
    motivo.value = '';
    openViewCitacion.value = true;
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
                    <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion">
                        <span style="font-size: 1.4rem">{{ alias }}</span>
                    </div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-gray-900 dark:text-surface-0" style="font-size: 1.3rem">Sucesos de {{ props.nombre }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-600 dark:text-surface-0" style="font-size: 0.9rem">{{ props.grado }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Presente -->
            <div class="card-asistencia-visual presente-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Baja</span>
                    <span class="asistencia-visual-cantidad">{{ baja }}</span>
                </div>
                <span class="asistencia-visual-icon-circle presente-card-icon">
                    <i class="bi bi-check-lg" style="font-size: 1.2rem"></i>
                </span>
            </div>
            <!-- Tardanza -->
            <div class="card-asistencia-visual falta-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Media</span>
                    <span class="asistencia-visual-cantidad">{{ media }}</span>
                </div>
                <span class="asistencia-visual-icon-circle falta-card-icon">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.1rem"></i>
                </span>
            </div>
            <!-- Falta -->
            <div class="card-asistencia-visual tarde-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Alta</span>
                    <span class="asistencia-visual-cantidad">{{ alta }}</span>
                </div>
                <span class="asistencia-visual-icon-circle tarde-card-icon">
                    <i class="bi bi-x" style="font-size: 1.1rem"></i>
                </span>
            </div>
            <!-- Total -->
            <div class="card-asistencia-visual info-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Total</span>
                    <span class="asistencia-visual-cantidad">{{ totalSucesos }}</span>
                </div>
                <span class="asistencia-visual-icon-circle info-card-icon">
                    <i class="bi bi-bar-chart-fill" style="font-size: 1.1rem"></i>
                </span>
            </div>
        </div>
        <div class="card-border" style="margin-top: 1rem">
            <Toolbar class="mb-1">
                <template #end>
                    <Button label="Cita" v-if="!esDirectora" icon="bi bi-whatsapp" severity="success" style="width: 9rem" class="mr-3" @click="openCitacion" />
                    <Button label="Exportar" v-if="totalRecords != 0" icon="pi pi-upload" outlined severity="help" @click="descargarPDF" />
                </template>
            </Toolbar>
        </div>
        <div class="card-border" style="margin-top: 1rem; margin-bottom: 1rem">
            <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
                <div class="flex align-items-center gap-2">
                    <i class="bi bi-folder-fill" style="font-size: 1.55rem"></i>
                    <h4 class="m-0">Historial de Sucesos</h4>
                </div>
                <InputText placeholder="Buscar..." class="w-72" v-model="search" @input="onSearch" />
            </div>
            <p v-if="totalRecords === 0" class="text-center my-4 text-gray-500" style="margin-top: 1rem">No hay registros de asistencia para la fecha seleccionada</p>
            <DataTable
                v-else-if="sucesos"
                :value="sucesos"
                lazy
                :paginator="true"
                :rows="5"
                :totalRecords="totalRecords"
                :first="lazyParams.page * lazyParams.rows"
                @page="onPage"
                :loading="false"
                dataKey="id"
                ref="dt"
                :lazy="true"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            >
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold"></span>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 3rem" />
                <Column field="nombre" header="Nombre" style="min-width: 20rem" />
                <Column field="fecha" header="Fecha" style="min-width: 8rem" />
                <Column header="Nivel" style="min-width: 8rem">
                    <template #body="slotProps">
                        <span
                            class="estado-badge"
                            :class="{
                                alta: slotProps.data.nivel === 'ALTA',
                                media: slotProps.data.nivel === 'MEDIA',
                                baja: slotProps.data.nivel === 'BAJA'
                            }"
                        >
                            {{ slotProps.data.nivel }}
                        </span>
                    </template>
                </Column>
                <Column header="Accion" style="min-width: 3rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button icon="bi bi-file-earmark-text-fill" style="font-size: 1.3rem" text severity="info" @click="abrirDetalleSuceso(slotProps.data.id)" />
                            <Button icon="bi bi-filetype-pdf" style="font-size: 1.3rem" text severity="help" @click="descargarSucesoPDF(slotProps.data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <template #footer>
            <Button label="Cerrar" outlined @click="cerrarDialogo" />
        </template>
    </Dialog>
    <!-- Citacion a su padre de familia-->
    <Dialog v-model:visible="openViewCitacion" modal :style="{ width: '40rem' }">
        <template #header>
            <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                <i class="bi bi-envelope-arrow-up-fill text-blue-600 dark:text-blue-700" style="font-size: 1.2rem"></i>
                <span class="font-semibold text-blue-600 dark:text-blue-700" style="font-size: 1.1rem; margin-left: 0.5rem">Mensaje de Citacion</span>
            </div>
        </template>
        <!-- Fecha y Hora -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-top: 1rem">
            <div>
                <label class="text-gray-500 dark:text-gray-400 mb-1 block">Fecha </label>
                <DatePicker v-model="fechaCita" :minDate="today" dateFormat="yy-mm-dd" showIcon inputClass="w-full" class="w-full" />
            </div>
            <div>
                <label class="text-gray-500 dark:text-gray-400 mb-1 block">Hora</label>
                <Calendar v-model="hora" timeOnly hourFormat="24" class="w-full" inputClass="w-full " :showIcon="true" />
            </div>
        </div>
        <!-- Motivo -->
        <div style="margin-top: 1rem">
            <label class="text-gray-500 dark:text-gray-400 mb-1 block">Motivo de la Consulta</label>
            <Textarea v-model="motivo" placeholder="Describe el motivo de la consulta aquí.." :autoResize="true" rows="5" cols="30" style="width: 100%" />
        </div>
        <template #footer>
            <Button label="Cerrar" @click="openViewCitacion = false" />
            <Button label="Enviar" :loading="loading" class="p-button-success" @click="enviar" />
        </template>
    </Dialog>

    <!-- Dialog de detalle del suceso-->
    <Dialog v-model:visible="mostrarDetalle" modal :style="{ width: '40rem' }">
        <template #header>
            <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                <i class="bi bi-file-earmark-text text-blue-600 dark:text-blue-700" style="font-size: 1.2rem"></i>
                <span class="font-semibold text-blue-600 dark:text-blue-700" style="font-size: 1.1rem; margin-left: 0.5rem">Detalle del Suceso</span>
            </div>
        </template>
        <div class="p-fluid grid gap-3">
            <div class="border rounded-lg p-5 bg-white dark:bg-gray-800">
                <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información General</h2>
                <div class="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-6" style="margin-top: 1.5rem">
                    <!-- Nombre del suceso -->
                    <div class="flex flex-col w-full md:w-3/4">
                        <strong class="text-gray-700 dark:text-gray-300">Nombre del Suceso:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1 break-all whitespace-normal">
                            {{ nombreIncidente }}
                        </p>
                    </div>

                    <!-- Fecha -->
                    <div class="flex flex-col w-full md:w-1/4">
                        <strong class="text-gray-700 dark:text-gray-300">Fecha:</strong>
                        <p class="text-gray-600 dark:text-gray-400 mt-1 break-all whitespace-normal">
                            {{ fecha }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-surface-900 p-5 rounded-lg shadow border border-gray-200 dark:border-surface-700" style="margin-top: 1rem">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Detalles</h3>

                <!-- Detalles del suceso -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Detalles del Suceso:</p>
                    <div class="mt-1 bg-blue-50 dark:bg-surface-700 text-gray-700 dark:text-surface-100 rounded px-4 py-2 text-justify text-sm sm:text-base whitespace-normal leading-relaxed">
                        {{ detalleIncidente }}
                    </div>
                </div>

                <!-- Argumentos del Alumno -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Argumentos del Alumno:</p>
                    <div class="mt-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500 rounded px-4 py-2 whitespace-normal text-justify text-sm sm:text-base leading-relaxed">
                        {{ argumentoAlumno }}
                    </div>
                </div>

                <!-- Acciones Realizadas -->
                <div class="mb-4">
                    <p class="font-semibold text-gray-800 dark:text-white">Acciones Realizadas:</p>
                    <div class="mt-1 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                        {{ accionesTomadas }}
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cerrar" @click="mostrarDetalle = false" />
        </template>
    </Dialog>
</template>
