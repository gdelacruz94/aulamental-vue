<script setup>
import DialogCitaConfirmacion from '@/components/cita/DialogCitaConfirmacion.vue';
import { useCitasDetailsPsicologo } from '@/composables/useCita/useCitaDetailsPsicologo';
import { usegetCitasPsicologo } from '@/composables/useCita/useCitaPsicologoPage';
import { Column } from 'primevue';
import { onMounted, ref } from 'vue';

const { total, pendiente, confirmadas, cancelados, cargar } = useCitasDetailsPsicologo();
const tabla = ref(null);
const openViewDialog = ref(false);
const nombreSelect = ref(null);
const fechaSelect = ref(null);
const horaSelect = ref(null);
const motivoSelect = ref(null);
const estadoSelect = ref(null);
const idSelect = ref(null);

function openConfirmacionDialog(nombre, fecha, hora, motivo, estado, id) {
    nombreSelect.value = nombre;
    fechaSelect.value = fecha;
    horaSelect.value = hora;
    motivoSelect.value = motivo;
    estadoSelect.value = estado;
    idSelect.value = id;
    openViewDialog.value = true;
}

onMounted(() => {
    const idUsuario = localStorage.getItem('id');
    cargar(idUsuario);
    tabla.value = usegetCitasPsicologo(idUsuario);
});

function recargarAsignarciones() {
    const idUsuario = localStorage.getItem('id');
    cargar(idUsuario);
    tabla.value = usegetCitasPsicologo(idUsuario);
}
</script>

<template>
    <div>
        <h2>Gestion de Citas</h2>
        <p class="subtitle">Administra y confirma las citas programadas con tus pacientes.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Total Asignadas (blanco) -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ total }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Total de Citas</span>
            </div>

            <!-- Pendientes -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-gray-800 dark:text-gray-200">{{ pendiente }}</span>
                <span class="text-base text-gray-700 dark:text-gray-300 mt-2">Pendientes</span>
            </div>

            <!-- Completados -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-green-600 dark:text-green-300">{{ confirmadas }}</span>
                <span class="text-base text-green-600 dark:text-green-300 mt-2">Confirmadas</span>
            </div>

            <!-- En Revisión -->
            <div class="flex flex-col items-center justify-center rounded-xl border border-yellow-300 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900 p-6 shadow-md min-w-[150px]">
                <span class="text-4xl font-bold text-yellow-600 dark:text-yellow-300">{{ cancelados }}</span>
                <span class="text-base text-yellow-600 dark:text-yellow-300 mt-2">Canceladas</span>
            </div>
        </div>
        <div class="card" style="margin-top: 1rem">
            <p v-if="tabla?.data?.length === 0" class="text-center my-4 text-gray-500">No Asistencia Registradas</p>
            <DataTable
                v-if="tabla?.data?.length > 0"
                :value="tabla.data"
                :lazy="true"
                :paginator="true"
                :rows="10"
                :first="tabla.lazyParams.page * tabla.lazyParams.rows"
                :totalRecords="tabla.totalRecords"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                @page="tabla.onPage"
            >
                <Column field="nombre" header="Paciente" style="min-width: 15rem">
                    <template #body="slotProps">
                        <div class="flex items-center space-x-3 p-2">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                                <i class="bi bi-person-fill" style="font-size: 1.5rem"></i>
                            </div>
                            <div>
                                <div class="font-semibold text-black dark:text-white">{{ slotProps.data.nombre }}</div>
                                <div class="text-gray-500 dark:text-gray-400 text-sm">{{ slotProps.data.numero }}</div>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column field="fecha" header="Fecha" style="min-width: 5rem">
                    <template #body="{ data }">
                        <i class="bi bi-calendar" style="font-size: 1.2 rem; margin-right: 0.5rem"></i>
                        <span class="text-gray-800 dark:text-gray-200">{{ new Date(data.fecha).toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="hora" header="Hora" style="min-width: 5rem">
                    <template #body="{ data }">
                        <i class="bi bi-clock" style="font-size: 1.2 rem; margin-right: 0.5rem"></i>
                        <span class="text-gray-800 dark:text-gray-200">{{ data.hora }}</span>
                    </template>
                </Column>
                <Column field="motivo" header="Motivo" style="min-width: 20rem"></Column>
                <Column header="Estado">
                    <template #body="slotProps">
                        <div
                            class="etiqueta-grado"
                            :class="{
                                'bg-pendiente': slotProps.data.estado.includes('PENDIENTE'),
                                'bg-confirmado': slotProps.data.estado.includes('CONFIRMADA'),
                                'bg-cancelada': slotProps.data.estado.includes('CANCELADA')
                            }"
                        >
                            <span> {{ slotProps.data.estado }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Acciones" style="min-width: 8rem">
                    <template #body="slotProps">
                        <div class="flex items-center">
                            <Button
                                icon="bi bi-check2-circle"
                                label="Confirmar"
                                :disabled="slotProps.data.estado !== 'PENDIENTE'"
                                class="p-button-rounded p-button-text"
                                @click="openConfirmacionDialog(slotProps.data.nombre, slotProps.data.fecha, slotProps.data.hora, slotProps.data.motivo, slotProps.data.estado, slotProps.data.id)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <DialogCitaConfirmacion v-model:visible="openViewDialog" @save="recargarAsignarciones" :id="idSelect" :nombre="nombreSelect" :fecha="fechaSelect" :hora="horaSelect" :motivo="motivoSelect" :estado="estadoSelect" />
    </div>
</template>
