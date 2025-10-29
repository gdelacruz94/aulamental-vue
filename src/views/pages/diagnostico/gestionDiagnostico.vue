<script setup>
import ConfirmarDiagnostico from '@/components/diagnostico/ConfirmarDiagnostico.vue';
import EditarDiagnostico from '@/components/diagnostico/EditarDiagnostico.vue';
import RegistrarDiagnostico from '@/components/diagnostico/RegistrarDiagnostico.vue';
import { useDiagnosticos } from '@/composables/useDiagnostico/useDiagnosticos';
import { ref } from 'vue';

const showNewDialog = ref(false);
const showUpdateDialog = ref(false);
const showConfirDialog = ref(false);
const idDiagnostico = ref(null);
const nombreSelec = ref(null);
const estadoSelec = ref(null);

function openNew() {
    showNewDialog.value = true;
}

function openUpdate(id) {
    idDiagnostico.value = id;
    showUpdateDialog.value = true;
}

function openConfir(id, nombre, estado) {
    idDiagnostico.value = id;
    nombreSelec.value = nombre;
    estadoSelec.value = estado;
    showConfirDialog.value = true;
}

const { dt, data: diagnosticos, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useDiagnosticos();

function recargarDiagnostico() {
    lazyLoad();
}
</script>

<template>
    <div>
        <h2>Gestión de Diagnósticos</h2>
        <p class="subtitle">Administra el registro de diagnósticos disponibles en el sistema para su posterior asignación a los usuarios.</p>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" style="width: 9rem" class="mr-3" @click="openNew" />
                    <Button label="Exportar" icon="pi pi-upload" outlined severity="help" @click="exportCSV" />
                </template>
            </Toolbar>
        </div>
        <div class="card">
            <DataTable
                :value="diagnosticos"
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
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} diagnósticos"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Administrar Diagnostico</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar diagnostico..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 5rem" />
                <Column field="nombre" header="Nombre" style="min-width: 15rem" />
                <Column field="descripcion" header="Descripción" style="min-width: 30rem" />
                <Column field="estado" header="Estado" style="min-width: 10rem">
                    <template #body="slotProps">
                        <span class="estado-badge" :class="slotProps.data.estado === 'ACTIVO' ? 'activo' : 'inactivo'">
                            {{ slotProps.data.estado }}
                        </span>
                    </template>
                </Column>
                <Column header="Acciones" :exportable="false" bodyClass="text-center" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button icon="bi bi-pencil-square" style="font-size: 1.3rem" text severity="warn" @click="openUpdate(slotProps.data.id)" />
                            <Button
                                :icon="slotProps.data.estado === 'ACTIVO' ? 'bi bi-toggle-on' : 'bi bi-toggle-off'"
                                :severity="slotProps.data.estado === 'ACTIVO' ? 'success' : 'danger'"
                                text
                                style="font-size: 1.3rem"
                                @click="openConfir(slotProps.data.id, slotProps.data.nombre, slotProps.data.estado)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <RegistrarDiagnostico v-model:visible="showNewDialog" @save="recargarDiagnostico" />
        <EditarDiagnostico v-model:visible="showUpdateDialog" @save="recargarDiagnostico" :DiagnosticoID="idDiagnostico" />
        <ConfirmarDiagnostico v-model:visible="showConfirDialog" @save="recargarDiagnostico" :Diagnosticoid="idDiagnostico" :nombre="nombreSelec" :estado="estadoSelec" />
    </div>
</template>
