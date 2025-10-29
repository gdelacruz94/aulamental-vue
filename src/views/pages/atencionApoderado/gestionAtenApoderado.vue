<script setup>
import ExportarAtenApoderadoAsistenciaDialog from '@/components/atencionApoderado/ExportarAtenApoderadoAsistenciaDialog.vue';
import RegistrarAtenApoderadoDialog from '@/components/atencionApoderado/RegistrarAtenApoderadoDialog.vue';
import VisualizarAtenApoderadoDialog from '@/components/atencionApoderado/VisualizarAtenApoderadoDialog.vue';
import { useAtencionApoderados } from '@/composables/useAtenApoderado/useListaAtencionApoderado';

import { ref } from 'vue';

const showRegistroDialog = ref(false);
const showViewDialog = ref(false);
const showExportarDialog = ref(false);
const apoderadoid = ref(null);
const nombreSelect = ref(null);
const fechaSelect = ref(null);
const telefonoSelect = ref(null);
const totalSelec = ref(null);

function openNew() {
    showRegistroDialog.value = true;
}

function openExport() {
    showExportarDialog.value = true;
}

function openView(id, nombre, fecha, telefono, total) {
    apoderadoid.value = id;
    fechaSelect.value = fecha;
    telefonoSelect.value = telefono;
    nombreSelect.value = nombre;
    totalSelec.value = total;
    showViewDialog.value = true;
}

const { dt, data: atenciones, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useAtencionApoderados();

function recargarAtencion() {
    lazyLoad();
}
</script>

<template>
    <div>
        <h2>Gestión de Atencion Apoderados</h2>
        <p class="subtitle">Registra y gestiona las atenciones psicológicas de los apoderados.</p>
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
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} diagnósticos"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Administrar Apoderados</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar por nombre..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 5rem" />
                <Column field="nombrecompleto" header="Nombre Completo" style="min-width: 10rem" />
                <Column header="Documento" style="min-width: 5rem">
                    <template #body="{ data: row }"> {{ row.tdocumento }}: {{ row.ndocumento }} </template>
                </Column>
                <Column header="Contacto" style="min-width: 2rem">
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
                <Column header="Cant. Atenciones">
                    <template #body="slotProps">
                        <div class="etiqueta-cantidad">
                            <span> {{ slotProps.data.cantAtencion }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="ultFecha" header="Ult. Fecha" />
                <Column header="Acciones" :exportable="false" bodyClass="text-center" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button
                                icon="bi bi-folder-fill"
                                label="Ver Atencion"
                                outlined
                                severity="info"
                                @click="openView(slotProps.data.id, slotProps.data.nombrecompleto, slotProps.data.ultFecha, slotProps.data.telefono, slotProps.data.cantAtencion)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <ExportarAtenApoderadoAsistenciaDialog v-model:visible="showExportarDialog" />
        <RegistrarAtenApoderadoDialog v-model:visible="showRegistroDialog" @save="recargarAtencion" />
        <VisualizarAtenApoderadoDialog v-model:visible="showViewDialog" :idUsuario="apoderadoid" :nombre="nombreSelect" :fecha="fechaSelect" :telefono="telefonoSelect" :total="totalSelec" />
    </div>
</template>
