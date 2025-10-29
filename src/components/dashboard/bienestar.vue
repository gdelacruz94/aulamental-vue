<script setup>
import { getDashboardBienestar } from '@/service/dashboardService';
import { Column } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();
const dashboardData = ref(null);
const idUsuario = localStorage.getItem('id');

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const fecha = new Date();
const mesActual = meses[fecha.getMonth()];

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
        const data = await getDashboardBienestar(idUsuario);
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
    <div class="grid grid-cols-9 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Gravedad Alta en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.cantALtaMes : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-x text-red-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Gravedad Media en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.cantMedMes : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-exclamation-triangle text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Gravedad Baja en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.cantBajaMes : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-check2 text-green-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-6 grid grid-cols-1 xl:grid-cols-5 gap-8" style="margin-top: 16px">
        <div class="card mb-0 xl:col-span-3">
            <div class="font-semibold text-base"><i class="bi bi-journals" /> Sucesos de Hoy</div>
            <DataTable style="margin-top: 1rem" :value="dashboardData?.sucesos" :paginator="true" :rows="5" stripedRows responsiveLayout="scroll">
                <Column field="id" header="Code" style="min-width: 1rem"></Column>
                <Column field="nombre" header="Nombre" style="min-width: 10rem"></Column>
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
                <Column field="suceso" header="Suceso" style="min-width: 20rem" />
                <template #empty>
                    <div class="text-center py-4 text-muted-color">No hay Sucesos registrados Hoy.</div>
                </template>
            </DataTable>
        </div>
        <div class="card mb-0 xl:col-span-2">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-base"><i class="bi bi-journals" /> Alumnos con/sin Sucesos</div>
            </div>
            <div class="flex justify-center">
                <Chart type="pie" style="width: 50%" :data="pieData" :options="pieOptions" />
            </div>
        </div>
    </div>
</template>
