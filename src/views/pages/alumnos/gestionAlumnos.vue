<script setup>
import VisualizarAlumnoDialog from '@/components/alumno/VisualizarAlumnoDialog.vue';
import { useAlumnos } from '@/composables/useAlumno/useAlumnoPage';
import { ref } from 'vue';
const showViewDialog = ref(null);
const idAlumnoSelec = ref(null);

function openView(id) {
    idAlumnoSelec.value = id;
    showViewDialog.value = true;
}

const { dt, data: alumnos, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useAlumnos();
</script>

<template>
    <div>
        <h2>Gestión de Estudiantes</h2>
        <p class="subtitle">Administra el registro de estudiantes del sistema</p>
        <div class="card">
            <DataTable
                :value="alumnos"
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
                        <h4 class="m-0">Administrar Estudiantes</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar por nombre..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="max-width: 1rem" />
                <Column field="nombre" header="Nombre" style="max-width: 8rem" />
                <Column header="Nivel/Seccion" style="max-width: 5rem">
                    <template #body="slotProps">
                        <div
                            class="etiqueta-grado"
                            :class="{
                                'bg-inicial': slotProps.data.grado.includes('Inicial'),
                                'bg-primaria': slotProps.data.grado.includes('Primaria'),
                                'bg-secundaria': slotProps.data.grado.includes('Secundaria')
                            }"
                        >
                            <span> {{ slotProps.data.grado }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="edad" header="Edad" style="max-width: 2rem" />
                <Column header="Telf. Apoderado" style="max-width: 3rem">
                    <template #body="{ data: row }">
                        <div class="inline-flex items-center space-x-1 text-sm">
                            <a
                                v-if="row.apotelefono"
                                :href="`https://wa.me/+51${row.apotelefono}`"
                                target="_blank"
                                rel="noopener"
                                class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
                            >
                                <i class="pi pi-whatsapp"></i> {{ row.apotelefono }}
                            </a>
                        </div>
                    </template>
                </Column>
                <Column field="direccion" header="Dirección" style="max-width: 12rem" />
                <Column header="Acciones" style="max-width: 2rem">
                    <template #body="slotProps">
                        <div class="flex items-center">
                            <Button icon="bi bi-info-circle" class="p-button-text" @click="openView(slotProps.data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <VisualizarAlumnoDialog v-model:visible="showViewDialog" :idUsuario="idAlumnoSelec" />
    </div>
</template>
