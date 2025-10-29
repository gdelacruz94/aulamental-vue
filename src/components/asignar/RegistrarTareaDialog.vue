<script setup>
import { useAlumnoDetalle } from '@/composables/useAlumno/useAlumnoDetalle';
import { useAlumnosSelect } from '@/composables/useAlumno/useAlumnosSelect';
import { useApoderadoSelec } from '@/composables/useApoderado/useApoderadoSelect';
import { useAsignarCreate } from '@/composables/useAsignar/useAsignarCreate';
import { usePracticantesSelect } from '@/composables/useAsignar/usePracticanteSelect';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, ref, watch } from 'vue';

const toast = useToast()

const emit = defineEmits(['update:visible', 'save'])
const {sugerenciasPrac, cargandoPrac, buscarPracticante } = usePracticantesSelect();
const practicanteSelec  = ref(null)
const {sugerenciasAPo, cargandoApo, buscarApoderado } = useApoderadoSelec();
const apoderadoSelec  = ref(null)

const { sugerencias, cargando, buscarAlumnos } = useAlumnosSelect();
const alumnoSeleccionado   = ref(null)


const { detalle, cargarDetalle } = useAlumnoDetalle();

const activeStep = ref(0)

const steps = [
  { label: 'Seleccionar de Practicante' },
  { label: 'Asignar Documentación' }
]


const tipoSeleccionado = ref(null) 

const tiposDocumento = [
  { label: 'Atención Alumno', value: 'ATENCIONALUMNO' },
  { label: 'Atención Apoderado', value: 'ATENCIONAPODERADO' }
]

const props = defineProps({
  visible: Boolean
})

watch(alumnoSeleccionado, async (nuevo) => {
  if (nuevo?.id) {
    await cargarDetalle(nuevo.id);
  }
});

function siguientePaso() {
  if (activeStep.value === 0 && !practicanteSelec.value) {
    toast.add({
      severity: 'warn',
      summary: 'Practicante requerido',
      detail: 'Selecciona un practicante antes de continuar.',
      life: 3000
    })
    return
  }
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}

function limpiarCampos() {
  practicanteSelec.value = null
  apoderadoSelec.value = null
  alumnoSeleccionado.value = null
  tipoSeleccionado.value = 'ATENCIONALUMNO'
  activeStep.value = 0
}


function pasoAnterior() {
  if (activeStep.value > 0) activeStep.value--
}

function cerrarDialogo () {
  limpiarCampos()
  emit('update:visible', false)
}

function obtenerIdPersonal() {
  if (tipoSeleccionado.value === 'ATENCIONALUMNO') {
    return alumnoSeleccionado.value?.id ?? null
  } else if (tipoSeleccionado.value === 'ATENCIONAPODERADO') {
    return apoderadoSelec.value?.id ?? null 
  }
  return null
}

const { guardarTarea, loading } = useAsignarCreate()

function guardarAsignacion() {
  const idPsicologo = localStorage.getItem('id')
  const idPersonal = obtenerIdPersonal()
  const idPracticante = practicanteSelec.value?.id ?? null
  const tipo = tipoSeleccionado.value

  if (!idPsicologo || !idPersonal || !idPracticante || !tipo) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Completa todos los campos antes de guardar.',
      life: 3000
    })
    return
  }

  const payload = {
    idPersonal,
    idPsicologo,
    idPracticante,
    tipodocumentacion: tipo
  }

  guardarTarea(payload)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Tarea asignada',
        detail: 'La asignación fue exitosa.',
        life: 3000
      })
      emit('save')
      cerrarDialogo()
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error al asignar',
        detail: 'Ocurrió un problema al guardar.',
        life: 3000
      })
    })
}

</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    @update:visible="val => emit('update:visible', val)"
    modal
    class="modal-personalizado"
    :style="{ maxWidth: '45rem', width: '76vw'}"   
    :breakpoints="{
    '1199px': '75vw',
    '991px':  '85vw',
    '767px':  '95vw',
    '575px':  '98vw'
  }">
    <template #header >
    <div class="diseño-header-modal" >
      <div class="flex align-items-center  justify-content-center" style="display: flex; align-items: center;">
        <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion-info"> 
          <i class="bi bi-person-plus" style="font-size: 1.7rem;"   />
        </div>
         <div class="flex flex-col gap-1" style="margin-left: 1rem;">
            <span class="font-semibold  text-gray-900 dark:text-surface-0" style="font-size: 1.3rem;">Asignar Tarea a Practicante</span>
          </div>
      </div>
    </div>
    </template>
    <Steps :model="steps" :activeStep="activeStep" class="mb-4" />
    <div class="contenedor-modal" v-if="activeStep === 0" >
      <!-- cabezera-->
       <div class="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-5 rounded-xl shadow-md w-full sm:w-auto" >
        <div class="flex items-start gap-4">
            <div class="text-white text-xl mt-1">
              <i class="bi bi-person" style="font-size: 3rem;"></i>
            </div>
            <div class="flex flex-col">
            <span class="text-base sm:text-lg font-semibold">Selección de Practicante</span>
            <p class="text-sm sm:text-base opacity-90 leading-snug">
                Selección de Practicante
            </p>
            </div>
        </div>
      </div>
      <!-- seleccion -->
       <div class="card-border" style="margin-top: 1rem;">
        <div class="flex flex-wrap gap-2 w-full">
            <label for="telefono">Seleccionar Practicante</label>
            <AutoComplete
              v-model="practicanteSelec"
              :suggestions="sugerenciasPrac"
              optionLabel="nombre"
              dropdown
              placeholder="Buscar practicante..."
              class="w-full"
              :minLength="1"
              :forceSelection="true"                   
              @complete="buscarPracticante" 
              @focus="buscarPracticante({ query: '' })"
              :panelClass="'shadow-lg rounded-lg'"
              inputClass="rounded-md" >
                <template #option="{ option }">
                  <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900  transition-colors cursor-pointer">
                  <span  class=" text-blue-600 dark:text-blue-400">{{ option.alias }}</span>
                  <div class="flex flex-col leading-tight">
                    <span class="font-medium text-gray-800 dark:text-gray-200">
                      {{ option.nombre }}
                    </span>
                  </div>
                </div>
                </template>
            </AutoComplete>
        </div>    
      </div>
      <!-- informacion-->
      <div class="card-border" v-if="practicanteSelec" style="margin-top: 1rem;">
      <div class="bg-[#f7faff] dark:bg-slate-800 border border-[#dceafe] dark:border-slate-700 rounded-xl p-5 shadow-sm w-full">
        <div class="flex justify-between items-center flex-wrap gap-4">

          <!-- Info izquierda -->
          <div class="flex items-start sm:items-center gap-4">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center">
              {{ practicanteSelec.alias }}
            </div>

            <!-- Texto -->
            <div class="flex flex-col gap-1 text-sm text-gray-900 dark:text-white">
              <div class="text-base font-semibold">{{practicanteSelec.nombre}}</div>
              
              <div class="flex flex-wrap gap-6 items-center text-sm text-gray-700 dark:text-gray-300">
                <div class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span class="font-medium">Teléfono:</span>
                  <span>{{ practicanteSelec.telefono }}</span>
                </div>

                <div class="flex items-center gap-1">
                  <span class="font-medium">Email:</span>
                  <span class="text-blue-700 dark:text-blue-300">{{ practicanteSelec.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Info derecha -->
          <div class="flex flex-col items-end gap-2">
            <span class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              {{ practicanteSelec.cantCerrados }} Completadas
            </span>
            <span class="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              {{ practicanteSelec.cantPendiente }} Pendientes
            </span>
          </div>

        </div>
      </div>
      </div>
    </div>
    <div v-else-if="activeStep === 1">
      <div class="bg-gradient-to-r from-green-500 to-teal-400 text-white p-5 rounded-xl shadow-md w-full sm:w-auto" >
        <div class="flex items-start gap-4">
          <div class="text-white text-2xl mt-1">
            <i class="bi bi-clipboard2-check-fill" style="font-size: 2.5rem;"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-base sm:text-lg font-semibold">
              Asignación de Documentación
            </span>
            <p class="text-sm sm:text-base opacity-90 leading-snug">
              Selecciona el tipo de atención y la persona a evaluar
            </p>
          </div>
        </div>
      </div>
      <div class="card-border" style="margin-top: 1rem;margin-bottom: 1rem;">
        <div class="flex flex-wrap gap-1">
          <label for="firstname2">Tipo de Documento</label>
          <Select
            id="tipoAtencion"
            v-model="tipoSeleccionado"
            :options="tiposDocumento"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione un documento"
            class="w-full"
            style="width: 29vmax;"
          />
        </div>        
      </div>
      <!-- atencion alumno-->
        <div v-if="tipoSeleccionado === 'ATENCIONALUMNO'" class="card-border" >
          <div class="flex flex-wrap gap-2 w-full">
            <label for="telefono">Seleccionar Estudiante</label>
            <AutoComplete
              v-model="alumnoSeleccionado"
              :suggestions="sugerencias"
              optionLabel="nombreCompleto"  
              dropdown
              placeholder="Buscar alumno..."
              class="w-full"
              :minLength="1"
              :forceSelection="true"                   
              @complete="buscarAlumnos" 
              @focus="buscarAlumnos({ query: '' })"
              :panelClass="'shadow-lg rounded-lg'"
              inputClass="rounded-md" >
                <template #option="{ option }">
                  <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900  transition-colors cursor-pointer">
                  <i class="pi pi-user text-blue-600 dark:text-blue-400"></i>
                  <div class="flex flex-col leading-tight">
                    <span class="font-medium text-gray-800 dark:text-gray-200">
                      {{ option.nombreCompleto }}
                    </span>
                    <small class="text-gray-500 dark:text-gray-400">
                      {{ option.nivelSeccion }}
                    </small>
                  </div>
                </div>
                </template>
            </AutoComplete>
          </div>
          <div v-if="alumnoSeleccionado" class="card-border-retangular mt-4">
              <div class="flex justify-between items-center text-sm gap-4 flex-wrap">
                <div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
                  <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Cantidad de Atenciones:</strong> {{ detalle.cantAsistencia }}</span>
                  <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Edad:</strong> {{ detalle.edad }} años</span>
                  <span class="inline-block whitespace-nowrap text-sm">
                    <strong class="text-indigo-700">Tel:</strong>
                    <a v-if="detalle.contact1" :href="`https://wa.me/+51${detalle.contact1}`" target="_blank" rel="noopener" style="margin-left: 1rem;"
                    class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 ml-1">
                    <i class="pi pi-whatsapp"></i> {{ detalle.contact1 }}
                  </a>
                  <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                </span>
                </div>
                <div class="shrink-0">
                  <div class="etiqueta-grado" :class="{ 'bg-inicial': detalle.nivel?.includes('Inicial'),'bg-primaria': detalle.nivel?.includes('Primaria'),'bg-secundaria': detalle.nivel?.includes('Secundaria')}" >
                    <span>{{ detalle.nivel }}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <!-- atencion apoderad-->
        <div v-if="tipoSeleccionado === 'ATENCIONAPODERADO'" class="card-border">
          <div class="flex flex-wrap gap-2 w-full">
            <label for="telefono">Seleccionar Apoderado</label>
            <AutoComplete
              v-model="apoderadoSelec"
              :suggestions="sugerenciasAPo"
              optionLabel="nombrecompleto"
              dropdown
              placeholder="Buscar apoderado..."
              class="w-full"
              :minLength="1"
              :forceSelection="true"                   
              @complete="buscarApoderado" 
              @focus="buscarApoderado({ query: '' })"
              :panelClass="'shadow-lg rounded-lg'"
              inputClass="rounded-md" >
                <template #option="{ option }">
                  <div class="flex items-center gap-3 p-2 whitespace-normal hover:bg-primary-50 dark:hover:bg-primary-900  transition-colors cursor-pointer">
                  <span  class=" text-blue-600 dark:text-blue-400">{{ option.alias }}</span>
                  <div class="flex flex-col leading-tight">
                    <span class="font-medium text-gray-800 dark:text-gray-200">
                      {{ option.nombrecompleto }}
                    </span>
                    <small class="text-gray-500 dark:text-gray-400">
                      {{ option.tdocumento }} : {{ option.ndocumento }}
                    </small>
                  </div>
                </div>
                </template>
            </AutoComplete>
          </div>
          <div v-if="apoderadoSelec" class="card-border-retangular mt-4">
              <div class="flex justify-between items-center text-sm gap-4 flex-wrap">
                <div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
                  <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Documento:</strong> {{ apoderadoSelec.tdocumento}} - {{apoderadoSelec.ndocumento}}</span>
                  <span class="inline-block whitespace-nowrap"><strong class="text-indigo-700">Atenciones:</strong> {{ apoderadoSelec.cantiAtencion }} registradas</span>
                  <span class="inline-block whitespace-nowrap text-sm">
                    <strong class="text-indigo-700">Tel:</strong>
                    <a  href="`https://wa.me/+51${apoderadoSelec.telefono}`" target="_blank" rel="noopener" style="margin-left: 1rem;"
                    class="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 ml-1">
                    <i class="pi pi-whatsapp"></i> {{ apoderadoSelec.telefono }}
                  </a>
                </span>
                </div>
              </div>
            </div>
        </div>
    </div>
    <template #footer>
      <Button label="Cancelar" text @click="cerrarDialogo" />
      <Button label="Anterior" text @click="pasoAnterior" :disabled="activeStep === 0"/>
      <Button v-if="activeStep < steps.length - 1" label="Siguiente" text @click="siguientePaso"/>
      <Button v-if="activeStep === steps.length - 1" label="Guardar"  :disabled="loading" @click="guardarAsignacion" />
    </template>
  </Dialog>
</template>
