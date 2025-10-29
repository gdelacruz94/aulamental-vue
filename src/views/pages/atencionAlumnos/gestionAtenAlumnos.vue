<script setup>
import ExportarAtenAlumnoAsistenciaDialog from '@/components/atencionAlumnos/ExportarAtenAlumnoAsistenciaDialog.vue';
import RegistrarAtenAlumnoDialog from '@/components/atencionAlumnos/RegistrarAtenAlumnoDialog.vue';
import VisualizarAtenAlumnoDialog from '@/components/atencionAlumnos/VisualizarAtenAlumnoDialog.vue';
import { useAtencionAlumnos } from '@/composables/useAtenAlumno/useAtencionAlumnos';
import { ref } from 'vue';

const showRegistroDialog = ref(false);
const showViewDialog = ref(false);
const alumnoid = ref(null);
const nombreSelec = ref(null);
const totalSelec = ref(null);
const anosSelec = ref(null);
const gradosSelec = ref(null);
const showExportDialog = ref(null);

function openNew() {
    showRegistroDialog.value = true;
}

function openExport() {
    showExportDialog.value = true;
}

function openView(id, nombre, total, anos, grado) {
    alumnoid.value = id;
    nombreSelec.value = nombre;
    totalSelec.value = total;
    anosSelec.value = anos;
    gradosSelec.value = grado;
    showViewDialog.value = true;
}

const { dt, data: atenciones, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useAtencionAlumnos();

function recargarAtencion() {
    lazyLoad();
}
</script>

<template>
    <div>
        <h2>Gestión de Atencion Alumos</h2>
        <p class="subtitle">Registra y gestiona las atenciones psicológicas de los alumnos.</p>
        <div class="card">
            <Toolbar class="mb-1">
                <template #start>
                    <Button label="Nueva Atencion" icon="pi pi-plus" severity="success" class="mr-3" @click="openNew" />
                    <Button label="Asistencia" icon="pi pi-download" outlined severity="help" @click="openExport" />
                </template>
            </Toolbar>
        </div>
        <div class="card">
            <DataTable
                ref="dt"
                :value="atenciones"
                :lazy="true"
                :paginator="true"
                :rows="lazyParams.rows"
                :totalRecords="totalRecords"
                @page="onPage"
                dataKey="id"
                lazy
                :first="lazyParams.page * lazyParams.rows"
                :rowsPerPageOptions="[5, 10, 25]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Estudiantes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Administrar Estudiantes</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar por nombre..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 5rem" />
                <Column field="nombrecompleto" header="Nombre Completo" style="min-width: 15rem" />
                <Column field="edad" header="Edad" style="min-width: 5rem" />
                <Column header="Telf. Apoderado" style="min-width: 12rem">
                    <template #body="{ data: row }">
                        <div class="inline-flex items-center space-x-1 text-sm">
                            <a
                                v-if="row.telefono"
                                :href="`https://wa.me/+51${row.telefono}`"
                                target="_blank"
                                rel="noopener"
                                class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
                            >
                                <i class="pi pi-whatsapp"></i> {{ row.telefono }}
                            </a>
                            <span v-if="row.telefono && row.telefono2" class="text-gray-400 dark:text-gray-600"> | </span>
                            <a
                                v-if="row.telefono2"
                                :href="`https://wa.me/+51${row.telefono2}`"
                                target="_blank"
                                rel="noopener"
                                class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
                            >
                                <i class="pi pi-whatsapp"></i>
                                {{ row.telefono2 }}
                            </a>
                            <span v-if="!row.telefono && !row.telefono2" class="text-gray-400 dark:text-gray-500">—</span>
                        </div>
                    </template>
                </Column>
                <Column header="Nivel/Seccion">
                    <template #body="slotProps">
                        <div
                            class="etiqueta-grado"
                            :class="{
                                'bg-inicial': slotProps.data.nivelseccion.includes('Inicial'),
                                'bg-primaria': slotProps.data.nivelseccion.includes('Primaria'),
                                'bg-secundaria': slotProps.data.nivelseccion.includes('Secundaria')
                            }"
                        >
                            <span> {{ slotProps.data.nivelseccion }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Cant. Atenciones">
                    <template #body="slotProps">
                        <div class="etiqueta-cantidad">
                            <span> {{ slotProps.data.cantAtencion }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="ultimaAtencion" header="Ult. Atencion" />
                <Column header="Acciones" :exportable="false" bodyClass="text-center" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button
                                icon="bi bi-folder-fill"
                                label="Ver Atencion"
                                outlined
                                severity="info"
                                @click="openView(slotProps.data.id, slotProps.data.nombrecompleto, slotProps.data.cantAtencion, slotProps.data.edad, slotProps.data.nivelseccion)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <ExportarAtenAlumnoAsistenciaDialog v-model:visible="showExportDialog" />
        <RegistrarAtenAlumnoDialog v-model:visible="showRegistroDialog" @save="recargarAtencion" />
        <VisualizarAtenAlumnoDialog v-model:visible="showViewDialog" :idUsuario="alumnoid" :nombre="nombreSelec" :total="totalSelec" :anos="anosSelec" :grado="gradosSelec" />
    </div>
</template>
