<script setup>
import VisualizarAsistenciaDialog from '@/components/Asistencia/VisualizarAsistenciaDialog.vue';
import { useAsistencias } from '@/composables/useAsistencia/useAsistencias';
import { onMounted, ref } from 'vue';

const showAsistenciaDialog = ref(false);

const usuarioId = ref(null);
const nombreSelec = ref(null);

function openAsistencia(id, nombre) {
    usuarioId.value = id;
    nombreSelec.value = nombre;
    showAsistenciaDialog.value = true;
}

const hoy = new Date();

const fechaFormateada = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
}).format(hoy);

const userId = localStorage.getItem('id');

const { data: rows, totalRecords, lazyParams, search, onPage, onSearch, lazyLoad: load } = useAsistencias(userId);

function recargarUsuarios() {
    load();
}

onMounted(load);
</script>

<template>
    <div>
        <h2>Gestión de Asistencia</h2>
        <div class="flex flex-wrap items-baseline gap-2 mt-[-9px]">
            <p class="subtitulo">Administra y supervisa el registro de asistencia del personal</p>
            <div class="inline-flex text-white px-3 py-1 rounded whitespace-nowrap" style="background-color: #3b82f6"><i class="bi bi-calendar mr-2 text-sm" /> {{ fechaFormateada }}</div>
        </div>
        <div class="card" style="margin-top: 1.2rem">
            <DataTable
                :value="rows"
                :lazy="true"
                dataKey="id"
                :paginator="true"
                :rows="lazyParams.rows"
                :first="lazyParams.first"
                :totalRecords="totalRecords"
                @page="onPage"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Control de Asistencia</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar por nombre..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="nombre" header="Nombre Completo" style="min-width: 16rem" />
                <Column field="telefono" header="Contacto">
                    <template #body="{ data }">
                        <a
                            :href="`https://wa.me/+51${data.telefono.replace(/\\D/g, '')}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
                        >
                            <i class="pi pi-whatsapp"></i>
                            {{ data.telefono }}
                        </a>
                    </template>
                </Column>
                <Column field="ultimaAsistencia" header="Ultima Asistencia" />
                <Column field="estado" header="Estado">
                    <template #body="slotProps">
                        <span class="estado-badge" :class="slotProps.data.estado === 'ACTIVO' ? 'activo' : 'inactivo'">
                            {{ slotProps.data.estado }}
                        </span>
                    </template>
                </Column>
                <Column header="Acciones" :exportable="false" bodyClass="text-center" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button icon="bi bi-folder-fill" label="Ver Registro" outlined severity="info" @click="openAsistencia(slotProps.data.id, slotProps.data.nombre)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <VisualizarAsistenciaDialog v-model:visible="showAsistenciaDialog" :idUsuario="usuarioId" :nombre="nombreSelec" @save="recargarUsuarios" />
    </div>
</template>
