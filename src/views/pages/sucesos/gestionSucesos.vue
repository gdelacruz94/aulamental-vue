<script setup>
import RegistrarSucesosDialog from '@/components/sucesos/RegistrarSucesosDialog.vue';
import VisualizarSucesosDialog from '@/components/sucesos/VisualizarSucesosDialog.vue';
import { useSucesos } from '@/composables/useSuceso/useSucesos';
import { computed, ref } from 'vue';

const showNewDialog = ref(false);
const showViewDialog = ref(false);

const usuarioId = ref(null);
const nombreSelec = ref(null);
const gradoSelec = ref(null);

function openNew() {
    showNewDialog.value = true;
}

function openView(id, nombre, grado) {
    usuarioId.value = id;
    nombreSelec.value = nombre;
    gradoSelec.value = grado;
    showViewDialog.value = true;
}

const rolesUsuario = JSON.parse(localStorage.getItem('roles') || '[]');

const esDirectora = computed(() => rolesUsuario.includes('Directora'));

const { dt, data, totalRecords, lazyParams, search, onPage, onSearch, exportCSV } = useSucesos();
</script>

<template>
    <div>
        <h2>Gestión de Sucesos</h2>
        <p class="subtitle">Administra el registro de suceso del sistema</p>
        <div class="card" v-if="!esDirectora">
            <Toolbar class="mb-1">
                <template #start>
                    <Button v-if="!esDirectora" :disabled="esDirectora" label="Registra Nuevo Suceso" icon="pi pi-plus" severity="success" style="width: 15rem" class="mr-3" @click="openNew" />
                </template>
            </Toolbar>
        </div>
        <div class="card">
            <DataTable
                ref="dt"
                :value="data"
                dataKey="id"
                :paginator="true"
                :totalRecords="totalRecords"
                :rows="lazyParams.rows"
                :lazy="true"
                @page="onPage"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Estudiantes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Administrar Estudiantes</h4>
                        <IconField style="right: 1rem">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 110%" v-model="search" placeholder="Buscar estudiante..." @input="onSearch" />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="nombrecompleto" header="Nombre Completo" style="min-width: 16rem" />
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
                <Column header="Acciones" :exportable="false" bodyClass="text-center" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button icon="bi bi-folder-fill" label="Ver Sucesos" outlined severity="info" @click="openView(slotProps.data.id, slotProps.data.nombrecompleto, slotProps.data.nivelseccion)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <RegistrarSucesosDialog v-model:visible="showNewDialog" />
        <VisualizarSucesosDialog v-model:visible="showViewDialog" :idUsuario="usuarioId" :nombre="nombreSelec" :grado="gradoSelec" />
    </div>
</template>
