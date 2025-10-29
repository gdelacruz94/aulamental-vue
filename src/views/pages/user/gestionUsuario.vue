<script setup>
import ConfirmarUsuarioDialog from '@/components/Usuario/ConfirmarUsuarioDialog.vue';
import EditarUsuarioDialog from '@/components/Usuario/EditarUsuarioDialog.vue';
import RegistrarUsuarioDialog from '@/components/Usuario/RegistrarUsuarioDialog.vue';
import VisualizarUsuarioDialog from '@/components/Usuario/VisualizarUsuarioDialog.vue';
import { useUsuarios } from '@/composables/useUsuario/useUsuarios';
import { ref } from 'vue';

const showNewDialog = ref(false);
const showViewDialog = ref(false);
const showConfirmeDialog = ref(false);
const showUpdateDialog = ref(false);

const usuarioId = ref(null);
const nombreSelec = ref(null);
const estadoSelec = ref(null);

function openNew() {
    showNewDialog.value = true;
}

function openView(id) {
    usuarioId.value = id;
    showViewDialog.value = true;
}

function openConfirme(id, nombre, estado) {
    usuarioId.value = id;
    nombreSelec.value = nombre;
    estadoSelec.value = estado;
    showConfirmeDialog.value = true;
}

function openUpdate(id, nombreCompleto) {
    usuarioId.value = id;
    nombreSelec.value = nombreCompleto;
    showUpdateDialog.value = true;
}

const id = localStorage.getItem('id');

const { dt, data: usuarios, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = useUsuarios(id);

function recargarUsuarios() {
    lazyLoad();
}
</script>

<template>
    <div>
        <h2>Gestión de Usuarios</h2>
        <p class="subtitle">Administra el registro de usuarios del sistema</p>
        <div class="card">
            <Toolbar class="mb-0">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-3" @click="openNew" />
                    <Button label="Exportar" icon="pi pi-download" outlined severity="help" @click="exportCSV($event)" />
                </template>
            </Toolbar>
        </div>
        <div class="card">
            <DataTable
                ref="dt"
                dataKey="id"
                :value="usuarios"
                :lazy="true"
                :paginator="true"
                :rows="lazyParams.rows"
                :totalRecords="totalRecords"
                :first="lazyParams.page * lazyParams.rows"
                emptyMessage="No hay usuarios registrados"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                @page="onPage"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Administrar Usuarios</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText style="width: 22rem" v-model="search" @input="onSearch" placeholder="Buscar por nombre..." />
                        </IconField>
                    </div>
                </template>
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="nombreCompleto" header="Nombre Completo" style="min-width: 16rem" />
                <Column header="Correo" style="min-width: 16rem">
                    <template #body="slotProps">
                        <i class="bi bi-envelope mr-2" /> <span>{{ slotProps.data.email }}</span>
                    </template>
                </Column>
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
                            <Button icon="bi bi-info-circle" style="font-size: 1.3rem" text severity="info" @click="openView(slotProps.data.id)" />
                            <Button icon="bi bi-pencil-square" style="font-size: 1.3rem" text severity="warn" @click="openUpdate(slotProps.data.id, slotProps.data.nombreCompleto)" />
                            <Button
                                :icon="slotProps.data.estado === 'ACTIVO' ? 'bi bi-toggle-on' : 'bi bi-toggle-off'"
                                :severity="slotProps.data.estado === 'ACTIVO' ? 'success' : 'danger'"
                                text
                                style="font-size: 1.3rem"
                                @click="openConfirme(slotProps.data.id, slotProps.data.nombreCompleto, slotProps.data.estado)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <RegistrarUsuarioDialog v-model:visible="showNewDialog" @save="recargarUsuarios" />
        <VisualizarUsuarioDialog v-model:visible="showViewDialog" :idUsuario="usuarioId" />
        <ConfirmarUsuarioDialog v-model:visible="showConfirmeDialog" :idUsuario="usuarioId" :nombre="nombreSelec" :estado="estadoSelec" @save="recargarUsuarios" />
        <EditarUsuarioDialog v-model:visible="showUpdateDialog" :idUsuario="usuarioId" :nombreCompleto="nombreSelec" @save="recargarUsuarios" />
    </div>
</template>
