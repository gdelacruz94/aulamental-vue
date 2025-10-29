<script setup>
import { getDashboardDirectora } from '@/service/dashboardService';
import { Column } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();
const dashboardData = ref(null);
const idUsuario = localStorage.getItem('id');

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const fecha = new Date();
const mesActual = meses[fecha.getMonth()];

onMounted(async () => {
    try {
        const data = await getDashboardDirectora(idUsuario);
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
    if (!dashboardData.value || dashboardData.value.totalAsistenciahoy === 0) {
        return 0;
    }
    return Math.round((dashboardData.value.totalAsistenciaActual * 100) / dashboardData.value.totalAsistenciahoy);
});
</script>
<template>
    <div class="grid grid-cols-9 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Usuario</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.cantiUsuario : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-people-fill text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ dashboardData ? dashboardData.cantiUsuarioActivo : '0' }}</span>
                <span class="text-muted-color"> Total de Usuarios Activos</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total de Sucesos en {{ mesActual }}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.totalSucesos : '0' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="bi bi-journal-bookmark-fill text-red-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ dashboardData ? dashboardData.totalAlumnosSucesos : '0' }}</span>
                <span class="text-muted-color"> Total de Sucesos por Alumno</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Asistencias del Dia</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardData ? dashboardData.totalAsistenciaActual : '0' }} / {{ dashboardData ? dashboardData.totalAsistenciahoy : '0' }}</div>
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
        <div class="card mb-0">
            <div class="flex justify-between items-center">
                <div class="font-semibold text-base"><i class="bi bi-journals" /> Sucesos de Hoy</div>
            </div>
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
</template>
