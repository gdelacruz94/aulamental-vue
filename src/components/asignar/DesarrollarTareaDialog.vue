<script setup>
import { useAtencionPracticante } from '@/composables/useAsignar/useAtencionPracticante';
import { useDiagnosticoSelect } from '@/composables/useDiagnostico/useDiagnosticoSelect';
import { getDetalleAtencionAlumno } from '@/service/AtencionAlumnoService';
import { getDetalleAtencionApoderado } from '@/service/AtencionApoderadosService';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

const emit = defineEmits(['update:visible', 'save']);

const props = defineProps({
    visible: Boolean,
    id: Number,
    nombre: String,
    tipodocumentacion: String,
    idDocumento: Number,
    estado: String,
    fecha: String,
    observacion: String
});

const visibleLocal = ref(false);
const detalle = ref(null);
const cargando = ref(false);
const { sugerenciasDiag, cargandoDiag, buscarDiagnostico } = useDiagnosticoSelect();
const { guardarAtencionAlumno, guardarAtencionApoderado } = useAtencionPracticante();
const diagnosticoSelecci = ref(null);

const motivo = ref(null);
const resumen = ref(null);
const conclusion = ref(null);
const tecnicas = ref(null);
const recomendacion = ref(null);
const comentario = ref(null);
const intervenciones = ref('');
const toast = useToast();

const camposDeshabilitados = computed(() => {
    return props.estado === 'CERRADO' || props.estado === 'ENVIADO';
});

function resetFormulario() {
    motivo.value = null;
    resumen.value = null;
    conclusion.value = null;
    tecnicas.value = null;
    recomendacion.value = null;
    comentario.value = null;
    intervenciones.value = '';
    diagnosticoSelecci.value = null;
}

const tipoMapeo = {
    ATENCIONALUMNO: 'Atención Alumno',
    ATENCIONAPODERADO: 'Atención Apoderado'
};

function formatearTitulo(valor) {
    return tipoMapeo[valor] ?? valor;
}

watch(
    () => props.visible,
    async (val) => {
        visibleLocal.value = val;
        if (val) {
            await cargarDetalle();
        } else {
            detalle.value = null;
        }
    }
);

watch(visibleLocal, (val) => {
    resetFormulario();
    emit('update:visible', val);
});

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

async function cargarDetalle() {
    detalle.value = null;

    try {
        if (props.tipodocumentacion === 'ATENCIONALUMNO') {
            const res = await getDetalleAtencionAlumno(props.idDocumento);
            detalle.value = res.data;

            motivo.value = detalle.value?.motivo ?? null;
            resumen.value = detalle.value?.resumen ?? null;
            conclusion.value = detalle.value?.conclusion ?? null;
            tecnicas.value = detalle.value?.tecnicas ?? null;
            recomendacion.value = detalle.value?.recomendacion ?? null;
            comentario.value = detalle.value?.comentario ?? null;

            if (detalle.value?.Diagnostico) {
                const encontrado = sugerenciasDiag.value?.find((d) => d.nombre === detalle.value.Diagnostico);
                diagnosticoSelecci.value = encontrado || { id: null, nombre: detalle.value.Diagnostico };
            } else {
                diagnosticoSelecci.value = null;
            }
        } else if (props.tipodocumentacion === 'ATENCIONAPODERADO') {
            const res = await getDetalleAtencionApoderado(props.idDocumento);
            detalle.value = res.data;

            motivo.value = detalle.value?.motivo ?? null;
            resumen.value = detalle.value?.resumen ?? null;
            conclusion.value = detalle.value?.conclusiones ?? null;
            recomendacion.value = detalle.value?.recomendaciones ?? null;
            intervenciones.value = detalle.value?.intervencion ?? null;
            comentario.value = detalle.value?.comentario ?? null;
        } else {
            console.warn('Tipo de documentacion desconocido:', props.tipodocumentacion);
        }
    } catch (error) {
        console.error('Error al cargar detalle:', error);
    }
}

async function guardarInforme() {
    if (props.tipodocumentacion === 'ATENCIONALUMNO') {
        if (!motivo.value || !resumen.value || !conclusion.value || !recomendacion.value || !tecnicas.value || !comentario.value || !diagnosticoSelecci.value) {
            toast.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Completa todos los campos antes de guardar el informe del alumno.',
                life: 4000
            });
            return;
        }

        if (!diagnosticoSelecci.value || !diagnosticoSelecci.value.id) {
            toast.add({
                severity: 'warn',
                summary: 'Diagnóstico requerido',
                detail: 'Selecciona un diagnóstico válido antes de guardar.',
                life: 4000
            });
            return;
        }

        const payload = {
            idAsignacion: props.id,
            motivo: motivo.value,
            resumen: resumen.value,
            conclusion: conclusion.value,
            recomendacion: recomendacion.value,
            tecnicas: tecnicas.value,
            comentario: comentario.value,
            idDiagnostico: diagnosticoSelecci.value?.id
        };

        const success = await guardarAtencionAlumno(payload);
        if (success) {
            cerrarDialogo();
            emit('save');
        }
    } else if (props.tipodocumentacion === 'ATENCIONAPODERADO') {
        if (!motivo.value || !resumen.value || !conclusion.value || !recomendacion.value || !intervenciones.value || !comentario.value) {
            toast.add({
                severity: 'warn',
                summary: 'Campos requeridos',
                detail: 'Completa todos los campos antes de guardar el informe del apoderado.',
                life: 4000
            });
            return;
        }

        const payload = {
            idAsignacion: props.id,
            motivo: motivo.value,
            resumen: resumen.value,
            conclusiones: conclusion.value,
            recomendaciones: recomendacion.value,
            intervencion: intervenciones.value,
            fecha: props.fecha,
            comentario: comentario.value
        };

        const success = await guardarAtencionApoderado(payload);
        if (success) {
            cerrarDialogo();
            emit('save');
        }
    } else {
        toast.add({
            severity: 'error',
            summary: 'Tipo de documento desconocido',
            detail: 'No se puede guardar porque el tipo de documento no es válido.',
            life: 5000
        });
    }
}
</script>

<template>
    <Dialog
        v-model:visible="visibleLocal"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        :style="{ maxWidth: '90rem', width: '76vw' }"
        :breakpoints="{
            '1199px': '75vw',
            '991px': '85vw',
            '767px': '95vw',
            '575px': '98vw'
        }"
    >
        <template #header>
            <div class="flex items-center gap-3 p-3 rounded-lg surface-card">
                <div class="flex items-center justify-center rounded-lg" :style="{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }">
                    <i class="pi pi-file" style="font-size: 1.5rem"></i>
                </div>
                <div class="flex flex-col">
                    <span class="font-bold text-color" style="font-size: 1.1rem">Desarrollar Informe</span>
                    <span class="text-sm text-color-secondary" style="font-size: 0.88rem">Caso: {{ props.nombre }}</span>
                </div>
            </div>
        </template>

        <div class="px-5 py-3 rounded-lg border shadow-sm bg-primary-50 dark:bg-surface-800 border-primary-100 dark:border-surface-700 text-primary dark:text-white text-sm md:text-base">
            <!-- Encabezado -->
            <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center p-2 rounded-lg bg-blue-200 dark:bg-blue-900/30" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-file text-blue-600 dark:text-blue-300" style="font-size: 1.2rem"></i>
                    </div>
                    <span class="font-semibold text-base md:text-lg text-blue-600 dark:text-blue-300" style="font-size: 1.2rem"> Información del Caso </span>
                </div>
            </div>
            <!-- TARGETAS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Tarjeta PACIENTE -->
                <div class="flex items-center gap-3 p-5 rounded-lg shadow-sm bg-white dark:bg-[#1f2937]">
                    <div class="flex items-center justify-center rounded-full bg-blue-500 dark:bg-blue-400" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-white"></i>
                    </div>
                    <div>
                        <div class="text-xs uppercase text-gray-500 dark:text-gray-400">PACIENTE</div>
                        <div class="font-bold text-gray-800 dark:text-gray-100">{{ props.nombre }}</div>
                    </div>
                </div>

                <!-- Tarjeta FECHA DE CREACIÓN -->
                <div class="flex items-center gap-3 p-5 rounded-lg shadow-sm bg-white dark:bg-[#1f2937]">
                    <div class="flex items-center justify-center rounded-full bg-green-500 dark:bg-green-400" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-white"></i>
                    </div>
                    <div>
                        <div class="text-xs uppercase text-gray-500 dark:text-gray-400">FECHA DE CREACIÓN</div>
                        <div class="font-bold text-gray-800 dark:text-gray-100">{{ props.fecha }}</div>
                    </div>
                </div>

                <!-- Tarjeta TIPO DE DOCUMENTO -->
                <div class="flex items-center gap-3 p-5 rounded-lg shadow-sm bg-white dark:bg-[#1f2937]">
                    <div class="flex items-center justify-center rounded-full bg-purple-500 dark:bg-purple-400" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-clipboard text-white"></i>
                    </div>
                    <div>
                        <div class="text-xs uppercase text-gray-500 dark:text-gray-400">TIPO DE DOCUMENTO</div>
                        <div class="font-bold text-gray-800 dark:text-gray-100">{{ formatearTitulo(props.tipodocumentacion) }}</div>
                    </div>
                </div>
            </div>
            <!-- OBSERVACIONES -->
            <div v-if="props.observacion && props.observacion.trim() && props.estado != 'CERRADO'" class="rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-5 space-y-4" style="margin-top: 1rem">
                <!-- Encabezado con icono -->
                <div class="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 font-semibold">
                    <div class="flex items-center justify-center p-2 rounded-lg bg-yellow-100 dark:bg-yellow-800/30" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-exclamation-triangle text-yellow-700 dark:text-yellow-300" style="font-size: 1.2rem"></i>
                    </div>
                    <span>Observaciones del Supervisor</span>
                </div>
                <!-- Contenido de la observación -->
                <div class="border border-yellow-400 rounded-md bg-white dark:bg-surface-800 p-5 text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {{ props.observacion }}
                </div>
                <!-- Nota al pie -->
                <div class="flex items-center gap-2 border border-yellow-300 bg-yellow-100 dark:bg-yellow-800/30 rounded-md p-3 text-yellow-800 dark:text-yellow-300 text-sm">
                    <i class="pi pi-info-circle"></i>
                    <span><strong>Nota:</strong> Revisa estas observaciones antes de reenviar el informe.</span>
                </div>
            </div>
        </div>
        <!-- ATENCION ALUMNO  -->

        <div v-if="props.tipodocumentacion === 'ATENCIONALUMNO' && detalle" style="margin-top: 1rem">
            <div class="card-border">
                <!-- motivo-->
                <div class="flex flex-wrap gap-2 w-full" style="margin-top: 0.5rem">
                    <label for="telefono">Motivo de la Consulta</label>
                    <Textarea v-model="motivo" :disabled="camposDeshabilitados" placeholder="Describe brevemente el motivo principal de la atención..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                </div>
                <!-- resumen -->
                <div class="flex flex-wrap gap-2 w-full" style="margin-top: 1rem">
                    <label for="telefono">Resumen de la Sesión</label>
                    <Textarea v-model="resumen" :disabled="camposDeshabilitados" placeholder="Resumen de lo observado y trabajado durante la sesión..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                </div>
            </div>
            <div class="card-border">
                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                    <!-- Conclusion -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="tipoDoc">Conclusión</label>
                        <Textarea v-model="conclusion" :disabled="camposDeshabilitados" placeholder="Conclusiones profesionales basadas en la evaluación....." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                    <!-- Tenicas Utilizadas -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="numeroDoc">Técnicas Utilizadas</label>
                        <Textarea v-model="tecnicas" :disabled="camposDeshabilitados" placeholder="Detalla las técnicas, tests y herramientas utilizadas..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                    <!-- recomendaciones -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="tipoDoc">Recomendaciones</label>
                        <Textarea v-model="recomendacion" :disabled="camposDeshabilitados" placeholder="Recomendaciones específicas para el seguimiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                    <!-- comentarios -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="numeroDoc">Comentarios Adicionales</label>
                        <Textarea v-model="comentario" :disabled="camposDeshabilitados" placeholder="Comentarios adicionales, observaciones del comportamiento...." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                </div>
                <div class="flex flex-col w-full md:w-2/2 mt-6" style="margin-top: 1.5rem">
                    <!-- Diagnostico -->
                    <label class="mb-2" for="tipoDoc">Diagnostico</label>
                    <AutoComplete
                        v-model="diagnosticoSelecci"
                        :suggestions="sugerenciasDiag"
                        optionLabel="nombre"
                        :disabled="camposDeshabilitados"
                        dropdown
                        placeholder="Buscar Diagnostico..."
                        class="w-full"
                        :minLength="1"
                        :forceSelection="true"
                        @complete="buscarDiagnostico"
                        @focus="buscarDiagnostico({ query: '' })"
                        :panelClass="'shadow-lg rounded-lg'"
                        inputClass="rounded-md"
                    >
                        <template #option="{ option }">
                            <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors cursor-pointer w-[73vw] md:w-[65vw] lg:w-[55vw] xl:w-[20vw]">
                                <i class="bi bi-postcard-heart text-blue-600 dark:text-blue-400"></i>
                                <div class="flex flex-col leading-tight">
                                    <span class="font-medium text-gray-800 dark:text-gray-200">
                                        {{ option.nombre }}
                                    </span>
                                    <small class="text-gray-500 dark:text-gray-400">
                                        {{ option.descripcion }}
                                    </small>
                                </div>
                            </div>
                        </template>
                    </AutoComplete>
                </div>
            </div>
        </div>

        <!-- ATENCION APODERADO -->

        <div v-else-if="props.tipodocumentacion === 'ATENCIONAPODERADO' && detalle" style="margin-top: 1rem">
            <div class="card-border">
                <!-- motivo-->
                <div class="flex flex-wrap gap-2 w-full" style="margin-top: 0.5rem">
                    <label for="telefono">Motivo de la Consulta</label>
                    <Textarea v-model="motivo" :disabled="camposDeshabilitados" placeholder="Describe brevemente el motivo principal de la atención..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                </div>
                <!-- resumen -->
                <div class="flex flex-wrap gap-2 w-full" style="margin-top: 1rem">
                    <label for="telefono">Resumen de la Sesión</label>
                    <Textarea v-model="resumen" :disabled="camposDeshabilitados" placeholder="Resumen de lo observado y trabajado durante la sesión..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                </div>
            </div>

            <div class="card-border">
                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                    <!-- Conclusion -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="tipoDoc">Conclusiones</label>
                        <Textarea v-model="conclusion" :disabled="camposDeshabilitados" placeholder="Conclusiones profesionales basadas en la evaluación..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                    <!-- Recomendaciones -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="numeroDoc">Recomendaciones</label>
                        <Textarea v-model="recomendacion" :disabled="camposDeshabilitados" placeholder="Recomendaciones específicas para el seguimiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                    <!-- intervencion -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="tipoDoc">Intervención</label>
                        <Textarea v-model="intervenciones" :disabled="camposDeshabilitados" placeholder="Detalla las intervenciones que se han dado..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                    <!-- comentario -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label class="mb-2" for="numeroDoc">Comentarios Adicionales</label>
                        <Textarea v-model="comentario" :disabled="camposDeshabilitados" placeholder="Comentarios adicionales, observaciones del comportamiento..." :autoResize="true" rows="5" cols="30" style="width: 100%" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between items-center flex-wrap gap-3 mt-4">
                <!-- Botón Cerrar -->
                <Button label="Cerrar" severity="secondary" outlined class="flex-1 md:flex-none dark:border-gray-500 dark:text-gray-200" @click="cerrarDialogo" />

                <!-- Botones condicionales -->
                <template v-if="props.estado === 'REVISADO' || props.estado === 'PENDIENTE'">
                    <!-- Botón Enviar Informe -->
                    <Button label="Enviar Informe" icon="pi pi-paper-plane" severity="primary" class="flex-1 md:flex-none dark:bg-blue-600 dark:border-blue-600 dark:text-white" @click="guardarInforme" />
                </template>
            </div>
        </template>
    </Dialog>
</template>
