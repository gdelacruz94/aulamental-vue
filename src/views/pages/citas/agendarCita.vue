<script setup>
import { usePsicologoSelect } from '@/composables/useCita/useCitaListPsicologo';
import { usegetCitasAlumno } from '@/composables/useCita/useCitasAlumnoPage';
import { crearCita } from '@/service/citaService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const { sugerenciasPsico, cargandoPsico, buscarPsicologo } = usePsicologoSelect();
const psicologoSelec = ref(null);
const fecha = ref(null);
const today = new Date();
const hora = ref(null);
const motivo = ref('');
const toast = useToast();

const idAlumno = localStorage.getItem('id');

const { dt, data: citas, totalRecords, lazyParams, search, onPage, onSearch, exportCSV, lazyLoad } = usegetCitasAlumno(idAlumno);

function recargarCitas() {
    lazyLoad();
}

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

async function agendarCita() {
    if (!psicologoSelec || !fecha.value || !hora.value || !motivo.value) {
        toast.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa todos los campos', life: 3000 });
        return;
    }

    const payload = {
        idAlumno: idAlumno,
        idPsicologo: psicologoSelec.value.id,
        fecha: formatDate(fecha.value),
        hora: formatTime(hora.value),
        motivo: motivo.value
    };

    try {
        await crearCita(payload);
        toast.add({ severity: 'success', summary: 'Cita Agendada', detail: 'La cita se creó correctamente', life: 3000 });
        // Limpia campos
        psicologoSelec.value = null;
        fecha.value = null;
        hora.value = null;
        motivo.value = '';
        recargarCitas();
    } catch (error) {
        console.error(error);

        let mensaje = 'Error inesperado';

        if (error.response && error.response.data && error.response.data.message) {
            mensaje = error.response.data.message;
        } else if (error.message) {
            mensaje = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
            life: 3000
        });
    }
}
</script>

<template>
    <div>
        <h2>Agendar Nueva Cita</h2>
        <p class="subtitle">Programa tu cita con un psicólogo especializado.</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- NUEVA CITA -->
            <div class="border rounded-lg bg-white dark:bg-surface-800 p-6 shadow-sm">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-plus text-blue-600 dark:text-blue-400"></i>
                    <span class="font-semibold text-lg text-gray-800 dark:text-white">Nueva Cita</span>
                </div>

                <div class="flex flex-col gap-4">
                    <!-- Seleccionar Psicólogo -->
                    <div>
                        <label class="text-gray-500 dark:text-gray-400 mb-1 block">Seleccionar Psicólogo</label>
                        <AutoComplete
                            v-model="psicologoSelec"
                            :suggestions="sugerenciasPsico"
                            optionLabel="nombreCompleto"
                            dropdown
                            placeholder="Buscar psicólogo..."
                            class="w-full"
                            :minLength="1"
                            :forceSelection="true"
                            @complete="buscarPsicologo"
                            @focus="buscarPsicologo({ query: '' })"
                            :panelClass="'shadow-lg rounded-lg'"
                            inputClass="rounded-md"
                        >
                            <template #option="{ option }">
                                <div class="flex items-center gap-3 p-2 whitespace-normal dark:hover:bg-primary-900 transition-colors cursor-pointer">
                                    <i class="pi pi-user text-blue-600 dark:text-blue-400"></i>
                                    <div class="flex flex-col leading-tight">
                                        <span class="font-medium text-gray-800 dark:text-gray-200">
                                            {{ option.nombreCompleto }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <!-- Fecha y Hora -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-top: 1rem">
                        <div>
                            <label class="text-gray-500 dark:text-gray-400 mb-1 block">Fecha </label>
                            <DatePicker v-model="fecha" :minDate="today" dateFormat="yy-mm-dd" showIcon inputClass="w-full" class="w-full" />
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
                    <!-- Botón -->
                    <Button label="Agendar Cita" icon="pi pi-plus" style="height: 3rem" @click="agendarCita" />
                </div>
            </div>

            <!-- MIS CITAS AGENDADAS -->
            <div class="border rounded-lg bg-white dark:bg-surface-800 p-6 shadow-sm">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-file text-green-600 dark:text-green-400"></i>
                    <span class="font-semibold text-lg text-gray-800 dark:text-white">Mis Citas Agendadas</span>
                </div>
                <DataTable :value="citas" lazy :paginator="true" :rows="lazyParams.rows" :totalRecords="totalRecords" :first="lazyParams.page * lazyParams.rows" @page="onPage" dataKey="id" ref="dt" :lazy="true">
                    <Column header="Psicologo" field="nombre" />
                    <Column header="Fecha" field="fecha" />
                    <Column header="Hora">
                        <template #body="slotProps">
                            <i class="pi pi-clock" style="font-size: 0.9rem; margin-right: 0.2rem" /> <span> {{ slotProps.data.hora }}</span>
                        </template>
                    </Column>
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
                </DataTable>
            </div>
        </div>
    </div>
</template>
