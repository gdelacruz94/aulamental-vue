<script setup>
import { getDashboardPracticante } from '@/service/dashboardService';
import { Column } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const dashboardData = ref(null);
const idUsuario = localStorage.getItem('id');

const tipoMapeo = {
    ATENCIONALUMNO: 'Atención Alumno',
    ATENCIONAPODERADO: 'Atención Apoderado'
};

const getColor = (pendientes, total) => {
    const porcentajePendiente = (pendientes / total) * 100;
    if (porcentajePendiente === 0) return 'bg-green-500'; // todo completado
    if (porcentajePendiente <= 50) return 'bg-yellow-500'; // va bien
    return 'bg-orange-500'; // muchas pendientes
};

const getTextColor = (pendientes, total) => {
    const porcentajePendiente = (pendientes / total) * 100;
    if (porcentajePendiente === 0) return 'text-green-500';
    if (porcentajePendiente <= 50) return 'text-yellow-500';
    return 'text-orange-500';
};
function formatearTitulo(tipo) {
    return tipoMapeo[tipo] || tipo;
}

onMounted(async () => {
    try {
        const data = await getDashboardPracticante(idUsuario);
        dashboardData.value = data;
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el dashboard',
            life: 3000
        });
    }
});
</script>
<template>
    <div class="grid grid-cols-6 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium text-2xl mb-4">Total de Tareas Pendiente</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-3xl">{{ dashboardData ? dashboardData.perdientes : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-file-earmark-text text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <hr class="my-8 border-gray-300 dark:border-gray-700" />
                <div v-if="dashboardData" class="flex items-center justify-between w-full text-sm">
                    <div class="flex items-center gap-2 text-gray-700">
                        <i class="bi bi-calendar text-blue-600"></i>
                        <span>Progreso: </span>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-800 lg:w-24" style="height: 8px; width: 24rem">
                            <div :class="getColor(dashboardData.perdientes, dashboardData.total)" class="h-full" :style="{ width: (1 - dashboardData.perdientes / dashboardData.total) * 100 + '%' }"></div>
                        </div>
                        <span :class="getTextColor(dashboardData.perdientes, dashboardData.total)" class="ml-4 font-medium"> {{ ((1 - dashboardData.perdientes / dashboardData.total) * 100).toFixed(0) }}% </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card p-0">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <div class="card green mb-0 h-19">
                            <div class="flex justify-between mb-0">
                                <div>
                                    <span class="block text-muted-color font-medium mb-2">Total de tareas cerradas</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.cerrados : '0' }}</div>
                                </div>
                                <div class="flex items-center justify-center bg-green-200 dark:bg-green-600/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="bi bi-patch-check text-green-500 !text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <div class="card orange mb-0 h-19">
                            <div class="flex justify-between mb-0">
                                <div>
                                    <span class="block text-muted-color font-medium mb-2">Total de tarea de revicion</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.revisados : '0' }}</div>
                                </div>
                                <div class="flex items-center justify-center bg-red-200 dark:bg-red-600/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="bi bi-x-octagon text-red-500 !text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="my-4 border-gray-300 dark:border-gray-700" />
                <div class="flex items-center justify-between w-full text-sm">
                    <div class="flex items-center gap-2 text-gray-700">
                        <i class="bi bi-calendar text-blue-600"></i>
                        <span>Estados de documentos: </span>
                    </div>
                    <span class="text-blue-600 font-semibold">{{ dashboardData ? dashboardData.enviados : '0' }} enviados</span>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-6" style="margin-top: 16px">
        <div class="card mb-0">
            <div class="font-semibold text-base"><i class="bi bi-journal-minus" /> Tareas</div>
            <DataTable style="margin-top: 1rem" :value="dashboardData?.tareas" :paginator="true" :rows="5" stripedRows responsiveLayout="scroll">
                <Column field="id" header="Code"></Column>
                <Column field="titulo" header="Titulo"></Column>
                <Column field="fecha" header="Fecha" />
                <Column header="Estado" style="min-width: 8rem">
                    <template #body="slotProps">
                        <div
                            class="etiqueta-grado"
                            :class="{
                                'bg-pendiente': slotProps.data.estadoDocumento.includes('PENDIENTE'),
                                'bg-enviado': slotProps.data.estadoDocumento.includes('ENVIADO'),
                                'bg-revisado': slotProps.data.estadoDocumento.includes('REVISADO'),
                                'bg-cerrado': slotProps.data.estadoDocumento.includes('CERRADO')
                            }"
                        >
                            <span> {{ slotProps.data.estadoDocumento }}</span>
                        </div>
                    </template>
                </Column>
                <template #empty>
                    <div class="text-center py-4 text-muted-color">No hay Sucesos registrados Hoy.</div>
                </template>
            </DataTable>
        </div>
    </div>
</template>
