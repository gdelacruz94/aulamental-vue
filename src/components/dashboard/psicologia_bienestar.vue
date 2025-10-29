<script setup>
import { getDashboardPsicologoBienestar } from '@/service/dashboardService';
import { Column } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();
const dashboardData = ref(null);
const idUsuario = localStorage.getItem('id');

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const fecha = new Date();
const mesActual = meses[fecha.getMonth()];

const tipoMapeo = {
    ATENCIONALUMNO: 'Atención Alumno',
    ATENCIONAPODERADO: 'Atención Apoderado'
};

function formatearTitulo(tipo) {
    return tipoMapeo[tipo] || tipo;
}

const getColor = (cantidad) => {
    if (cantidad >= 8) return 'bg-red-500';
    if (cantidad >= 5) return 'bg-orange-500';
    if (cantidad >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
};

const getTextColor = (cantidad) => {
    if (cantidad >= 30) return 'text-red-500';
    if (cantidad >= 20) return 'text-orange-500';
    if (cantidad >= 10) return 'text-yellow-500';
    return 'text-green-500';
};

onMounted(async () => {
    try {
        const data = await getDashboardPsicologoBienestar(idUsuario);
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
const porcentajeAsistencia = computed(() => {
    if (!dashboardData.value || dashboardData.value.asistenciahoy === 0) {
        return 0;
    }
    return Math.round((dashboardData.value.asistenciahoyActual * 100) / dashboardData.value.asistenciahoy);
});

const pieData = computed(() => ({
    labels: ['Alumnos sin Sucesos', 'Alumnos con Sucesos'],
    datasets: [
        {
            data: dashboardData.value ? [dashboardData.value.cantAlumnoBien, dashboardData.value.cantAlumnoMal] : [0, 0],
            backgroundColor: ['#34D399', '#F87171'], // verde, rojo
            hoverBackgroundColor: ['#10B981', '#EF4444']
        }
    ]
}));

const pieOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#6B7280'
            }
        }
    }
};
</script>
<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Atenciones en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.totalAtencionMes : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-file-earmark-text text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ dashboardData ? dashboardData.totalAtencion : '0' }}</span>
                <span class="text-muted-color"> Total de Atenciones</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Sucesos en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.totalSucesosSemanal : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-journals text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ dashboardData ? dashboardData.totalSucesos : '0' }} </span>
                <span class="text-muted-color"> Total de Sucesos</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Tareas Pendientes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.totalTareasPendiente : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-list-task text-red-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ dashboardData ? dashboardData.totalTareas : '0' }}</span>
                <span class="text-muted-color"> Total de Tareas</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Asistencias del Dia</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.asistenciahoyActual : '0' }} / {{ dashboardData ? dashboardData.asistenciahoy : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-calendar text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ porcentajeAsistencia }} % </span>
                <span class="text-muted-color"> de asistencia</span>
            </div>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-6 grid grid-cols-1 xl:grid-cols-2 gap-8" style="margin-top: 16px">
        <div class="grid grid-rows-2 gap-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="card mb-0">
                    <div class="flex justify-between items-center mb-6">
                        <div class="font-semibold text-base"><i class="bi bi-activity" /> Top 5 de Diagnosticos</div>
                    </div>
                    <ul v-if="dashboardData && dashboardData.diagnosticos" class="list-none p-0 m-0">
                        <li v-for="(diagnostico, index) in dashboardData.diagnosticos" :key="index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                                    {{ diagnostico.nombre }}
                                </span>
                            </div>
                            <div class="mt-2 md:mt-0 flex items-center">
                                <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                    <div :class="getColor(diagnostico.cantidad)" class="h-full" :style="{ width: diagnostico.cantidad * 10 + '%' }"></div>
                                </div>
                                <span :class="getTextColor(diagnostico.cantidad)" class="ml-4 font-medium">{{ diagnostico.cantidad }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="card mb-0">
                    <div class="flex justify-between items-center mb-6">
                        <div class="font-semibold text-base"><i class="bi bi-journals" /> Alumnos con/sin Sucesos</div>
                    </div>
                    <Chart type="pie" :data="pieData" :options="pieOptions" />
                </div>
            </div>
            <div class="card mb-0 min-h-[350px]">
                <div class="font-semibold text-base"><i class="bi bi-list-task" /> Tareas Recibidas</div>
                <DataTable class="w-full" style="margin-top: 1rem; min-width: 100%" :value="dashboardData?.tareas" :paginator="true" :rows="5" stripedRows responsiveLayout="scroll">
                    <Column field="nombre" header="Practicante" />
                    <Column header="Tipo Documento" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <i class="bi bi-file-earmark-text text-blue-600 dark:text-blue-400" style="font-size: 1.1rem"></i>
                                <span class="text-gray-800 dark:text-gray-200">
                                    {{ formatearTitulo(data.tipodocumentacion) }}
                                </span>
                            </div>
                        </template>
                    </Column>
                    <Column field="fecha" header="Fecha" />
                    <template #empty>
                        <div class="text-center py-4 text-muted-color">No hay Tareas Recibidas.</div>
                    </template>
                </DataTable>
            </div>
        </div>
        <div class="card mb-0">
            <div class="font-semibold text-base"><i class="bi bi-calendar" /> Asitencia de Hoy</div>
            <DataTable style="margin-top: 1rem" :value="dashboardData?.asistencias" :paginator="true" :rows="5" stripedRows responsiveLayout="scroll">
                <Column field="id" header="Code"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="hora" header="Hora" />
                <Column field="estado" header="Estado">
                    <template #body="slotProps">
                        <span
                            class="estado-badge"
                            :class="{
                                presente: slotProps.data.estado === 'PRESENTE',
                                falta: slotProps.data.estado === 'FALTA',
                                tarde: slotProps.data.estado === 'TARDE'
                            }"
                        >
                            {{ slotProps.data.estado }}
                        </span>
                    </template>
                </Column>
                <template #empty>
                    <div class="text-center py-4 text-muted-color">No hay asistencias registradas hoy.</div>
                </template>
            </DataTable>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-6" style="margin-top: 16px">
        <div class="card mb-0">
            <div class="font-semibold text-base"><i class="bi bi-journals" /> Sucesos de Hoy</div>
            <DataTable style="margin-top: 1rem" :value="dashboardData?.sucesos" :paginator="true" :rows="5" stripedRows responsiveLayout="scroll">
                <Column field="id" header="Code"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column header="Nivel" style="min-width: 8rem">
                    <template #body="slotProps">
                        <span
                            class="estado-badge"
                            :class="{
                                alta: slotProps.data.nivel === 'ALTA',
                                media: slotProps.data.nivel === 'MEDIA',
                                baja: slotProps.data.nivel === 'BAJA'
                            }"
                        >
                            {{ slotProps.data.nivel }}
                        </span>
                    </template>
                </Column>
                <Column field="suceso" header="Suceso" />
                <template #empty>
                    <div class="text-center py-4 text-muted-color">No hay Sucesos registrados Hoy.</div>
                </template>
            </DataTable>
        </div>
    </div>
</template>
