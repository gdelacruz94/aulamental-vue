<script setup>
import { useAsistenciaStats } from '@/composables/useAsistencia/useAsistenciaStats';
import { useAsistenciasUsuario } from '@/composables/useAsistencia/useAsistenciasUsuario';
import { ref, watch } from 'vue';

const props = defineProps({ visible: Boolean, idUsuario: Number, nombre: String });
const emit = defineEmits(['update:visible']);

const { alias, presente, tardanza, falta, cargar } = useAsistenciaStats();

const fechaFiltro = ref(null);
const tabla = ref(null);

watch(
    () => props.visible,
    async (open) => {
        if (open && props.idUsuario) {
            fechaFiltro.value = null;

            tabla.value = useAsistenciasUsuario(props.idUsuario, fechaFiltro);

            cargar(props.idUsuario);

            await tabla.value.lazyLoad();
        }
    }
);

watch(fechaFiltro, async () => {
    if (tabla.value) {
        await tabla.value.lazyLoad();
    }
});

function cerrarDialogo() {
    emit('update:visible', false);
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        class="modal-personalizado"
        :style="{ maxWidth: '60rem', width: '76vw' }"
        :breakpoints="{
            '1199px': '75vw',
            '991px': '85vw',
            '767px': '95vw',
            '575px': '98vw'
        }"
    >
        <template #header>
            <div class="diseño-header-modal">
                <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                    <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion">
                        <span style="font-size: 1.4rem">{{ alias }}</span>
                    </div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-gray-900 dark:text-surface-0" style="font-size: 1.3rem">Registro de Asistencia</span>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-600 dark:text-surface-0" style="font-size: 0.9rem">{{ props.nombre }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-wrap gap-3 justify-content-center">
            <!-- Presente -->
            <div class="card-asistencia-visual presente-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Presente</span>
                    <span class="asistencia-visual-cantidad">{{ presente }}</span>
                </div>
                <span class="asistencia-visual-icon-circle presente-card-icon">
                    <i class="bi bi-check-lg" style="font-size: 1.2rem"></i>
                </span>
            </div>
            <!-- Tardanza -->
            <div class="card-asistencia-visual falta-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Tardanza</span>
                    <span class="asistencia-visual-cantidad">{{ tardanza }}</span>
                </div>
                <span class="asistencia-visual-icon-circle falta-card-icon">
                    <i class="bi bi-exclamation-triangle" style="font-size: 1.1rem"></i>
                </span>
            </div>
            <!-- Falta -->
            <div class="card-asistencia-visual tarde-card">
                <div class="asistencia-visual-texto">
                    <span class="asistencia-visual-etiqueta">Falta</span>
                    <span class="asistencia-visual-cantidad">{{ falta }}</span>
                </div>
                <span class="asistencia-visual-icon-circle tarde-card-icon">
                    <i class="bi bi-x" style="font-size: 1.1rem"></i>
                </span>
            </div>
        </div>

        <div class="card-border" style="margin-top: 1rem; margin-bottom: 1rem">
            <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
                <div class="flex align-items-center gap-2">
                    <i class="bi bi-calendar" style="font-size: 1.55rem"></i>
                    <h4 class="m-0">Historial de Asistencia</h4>
                </div>
                <DatePicker v-model="fechaFiltro" placeholder="Selecciona fecha" class="w-12rem" />
            </div>
            <p v-if="tabla?.data?.length === 0" class="text-center my-4 text-gray-500">No hay registros de asistencia para la fecha seleccionada</p>
            <DataTable
                v-if="tabla?.data?.length > 0"
                :value="tabla.data"
                :lazy="true"
                :paginator="true"
                :rows="5"
                :first="tabla.lazyParams.page * tabla.lazyParams.rows"
                :totalRecords="tabla.totalRecords"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                @page="tabla.onPage"
            >
                <Column field="id" header="Code" style="min-width: 1rem" />
                <Column field="fechaIngreso" header="Fecha" style="min-width: 5rem" />
                <Column field="horaIngreso" header="Hora" style="min-width: 5rem" />
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
            </DataTable>
        </div>
        <template #footer>
            <Button label="Cerrar" outlined @click="cerrarDialogo" />
        </template>
    </Dialog>
</template>
