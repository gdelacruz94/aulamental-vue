<script setup>
import RegistrarTareaDialog from '@/components/asignar/RegistrarTareaDialog.vue';
import VisualizarDesarrollo from '@/components/asignar/VisualizarDesarrollo.vue';
import { useAsignacionPsicologoStast } from '@/composables/useAsignar/useAsignarPsicologoDetails';
import { useAsignarlist } from '@/composables/useAsignar/useAsingarlist';
import { onMounted, ref } from 'vue';

const showNewDialog = ref(null);
const showViewDialog = ref(null);

const idSelect = ref(null);
const nombreSelect = ref(null);

const { totalpsicologo, pendientepsicologo, enviadopsicolgo, revicionpsicologo, completandopsicologo, cargarPsicolgo } = useAsignacionPsicologoStast();

function openNew() {
    showNewDialog.value = true;
}

function openView(id, nombre) {
    nombreSelect.value = nombre;
    idSelect.value = id;
    showViewDialog.value = true;
}

const { dt, data: asignaciones, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useAsignarlist();

function recargarAsignarciones() {
    lazyLoad();
    const idUsuario = localStorage.getItem('id');
    cargarPsicolgo(idUsuario);
}

onMounted(() => {
    const idUsuario = localStorage.getItem('id');
    cargarPsicolgo(idUsuario);
});
</script>

<template>
    <div>
        <h2>Gestión de Tarea</h2>
        <p class="subtitle">Administra y asigna informes de atención a practicantes de psicología.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <!-- Total Asignadas (blanco) -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ totalpsicologo }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Total Asignadas</span>
            </div>

            <!-- Pendientes -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-800 dark:text-gray-200">{{ pendientepsicologo }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Pendientes</span>
            </div>

            <!-- Enviados -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-blue-600 dark:text-blue-300">{{ enviadopsicolgo }}</span>
                <span class="text-base text-blue-600 dark:text-blue-300 mt-2">Enviados</span>
            </div>

            <!-- En Revisión -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-yellow-300 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-yellow-600 dark:text-yellow-300">{{ revicionpsicologo }}</span>
                <span class="text-base text-yellow-600 dark:text-yellow-300 mt-2">En Revisión</span>
            </div>

            <!-- Completados -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-green-600 dark:text-green-300">{{ completandopsicologo }}</span>
                <span class="text-base text-green-600 dark:text-green-300 mt-2">Completados</span>
            </div>
        </div>

        <div class="card" style="margin-top: 1rem">
            <Toolbar class="mb-1">
                <template #start>
                    <Button label="Asignar Tarea" icon="pi pi-plus" style="width: 12rem" class="mr-3" @click="openNew" />
                </template>
            </Toolbar>
        </div>
        <div class="card">
            <DataTable
                :value="asignaciones"
                lazy
                :paginator="true"
                :rows="lazyParams.rows"
                :totalRecords="totalRecords"
                :first="lazyParams.page * lazyParams.rows"
                @page="onPage"
                dataKey="id"
                ref="dt"
                :lazy="true"
                :rowsPerPageOptions="[5, 10, 25]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Tareas"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Informes de Atención</h4>
                        <IconField style="right: 1rem">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 110%" v-model="search" placeholder="Buscar nombre..." @input="onSearch" />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 5rem" />
                <Column field="nombre" header="Nombre" style="min-width: 20rem" />
                <Column header="Telefono" style="min-width: 12rem">
                    <template #body="{ data }">
                        <a
                            :href="`https://wa.me/+51${data.telefono.replace(/\\D/g, '')}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
                        >
                            <i class="pi pi-whatsapp mr-1"></i>
                            {{ data.telefono }}
                        </a>
                    </template>
                </Column>
                <Column field="fecha" header="Ult. Fecha" />
                <Column field="pendiente" header="Cant. Pendiente" />
                <Column field="enviados" header="Cant. Enviados" />
                <Column header="Accion">
                    <template #body="slotProps">
                        <Button icon="bi bi-file-earmark-text" label="Ver Tareas" outlined severity="info" @click="openView(slotProps.data.id, slotProps.data.nombre)" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <RegistrarTareaDialog v-model:visible="showNewDialog" @save="recargarAsignarciones" />
        <VisualizarDesarrollo v-model:visible="showViewDialog" @save="recargarAsignarciones" :id="idSelect" :nombre="nombreSelect" />
    </div>
</template>
