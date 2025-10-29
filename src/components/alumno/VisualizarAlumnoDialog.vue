<script setup>
import { getAlumnoById } from '@/service/AlumnoService';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  idUsuario: Number
});
const emit = defineEmits(['update:visible']);

function cerrarDialogo() {
  emit('update:visible', false);
}


const alumno = ref(null);
const apoderados = ref([]);
const cargando = ref(false);

watch(() => props.visible, async (open) => {
  if (open && props.idUsuario) {
    cargando.value = true;
    try {
      const data = await getAlumnoById(props.idUsuario);
      alumno.value = data;
      apoderados.value = data.apoderadoDtos || [];
    } catch (error) {
      console.error('Error al cargar alumno:', error);
    } finally {
      cargando.value = false;
    }
  }
});
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    @update:visible="val => emit('update:visible', val)"
    modal
    class="modal-personalizado"
    :style="{ maxWidth: '55rem', width: '90vw'}"    
     :breakpoints="{
    '1199px': '75vw',
    '991px':  '85vw',
    '767px':  '95vw',
    '575px':  '98vw'
  }">
  <template #header >
    <div class="diseño-header-modal" >
      <div class="flex align-items-center  justify-content-center" style="display: flex; align-items: center;">
        <div class="card-border-icon-visualizacion diseño-icon-modal-visualizacion"> 
          <i class="bi bi-person" style="font-size: 2rem;"></i>
        </div>
         <div class="flex flex-col gap-1" style="margin-left: 1rem;">
            <span class="font-semibold text-xl text-gray-900 dark:text-surface-0">Información del Estudiante</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-surface-0">Detalles completos del estudiante y sus apoderados</span>
            </div>
          </div>
      </div>
    </div>
  </template>
    <Tabs value="0" style="border-radius: 5rem;">
       <TabList>
        <Tab value="0"  >
          Datos Del Alumno
        </Tab>
        <Tab value="1">
          Datos de los Apoderados
        </Tab>
      </TabList>
      <TabPanels class="tab-diseño-visual">
        <TabPanel value="0">
          <div class="grid border rounded-lg p-5 bg-white dark:bg-gray-800 ">
           <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Datos del Alumno</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- ID del Estudiante -->
              <div class="flex flex-col">
                <div class="mb-3">
                  <strong class="text-gray-700 dark:text-gray-300">Code Alumno:</strong>
                  <p class="text-gray-800 dark:text-gray-100 mt-1">N° {{ props.idUsuario }}</p>
                </div>
              </div>

              <!-- Edad -->
              <div class="flex flex-col">
                <div class="mb-3">
                  <strong class="text-gray-700 dark:text-gray-300">Edad del Alumno:</strong>
                  <p class="text-gray-800 dark:text-gray-100 mt-1">{{ alumno?.edad }} años</p>
                </div>
              </div>

              <!-- Nombre Completo -->
              <div class="flex flex-col">
                <div class="mb-3">
                  <strong class="text-gray-700 dark:text-gray-300">Nombre del Alumno:</strong>
                  <p class="text-gray-800 dark:text-gray-100 mt-1">{{ alumno?.nombre }}</p>
                </div>
              </div>

              <!-- Grado -->
              <div class="flex flex-col">
                <div class="mb-3">
                  <strong class="text-gray-700 dark:text-gray-300">Grado:</strong>
                  <p class="text-gray-800 dark:text-gray-100 mt-1">{{ alumno?.grado }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-surface-900 p-5 rounded-lg shadow border border-gray-200 dark:border-surface-700" style="margin-top: 1rem;">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contacto de Emergencia</h3>
            <div class="mb-4">
              <p class="font-semibold text-gray-800 dark:text-white"> Telefono Apoderado:</p>
              <div class="mt-1 bg-blue-50 dark:bg-surface-700 text-gray-700 dark:text-surface-100 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                {{ alumno?.apotelefono }} 
              </div>
            </div>
            <div class="mb-4">
              <p class="font-semibold text-gray-800 dark:text-white">Direccion:</p>
              <div class="mt-1 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500 rounded px-4 py-2 text-justify text-sm sm:text-base leading-relaxed">
                {{ alumno?.direccion }}
              </div>
            </div>
        </div>
        </TabPanel>
        <TabPanel value="1">
          <div v-if="apoderados.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Sin apoderados registrados.
          </div>
          <div v-else class="flex flex-col gap-6">
            <div v-for="(apo, index) in apoderados" :key="index" class="border rounded-lg overflow-hidden bg-white dark:bg-surface-800">      
              <!-- Encabezado con parentesco -->
              <div class="flex items-center gap-2 px-4 py-3 bg-blue-600 dark:bg-blue-500">
                <i class="pi pi-user text-white"></i>
                <span class="text-white font-semibold">{{ apo.parentesco || 'APODERADO' }}</span>
              </div>

              <!-- Cuerpo con los campos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white dark:bg-gray-800">
                
                <!-- Nombre Completo -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre Completo:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.nombre || 'Sin datos' }}
                  </div>
                </div>

                <!-- Correo Electrónico -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Correo Electrónico:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.correo || 'Sin datos' }}
                  </div>
                </div>

                <!-- Teléfono -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Teléfono:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.telefono || 'Sin datos' }}
                  </div>
                </div>

                <!-- Ocupación -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ocupación:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.ocupacion || 'Sin datos' }}
                  </div>
                </div>

                <!-- Contacto Alternativo -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Contacto Alternativo:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.contactoAlternativo || 'Sin datos' }}
                  </div>
                </div>

                <!-- Dirección -->
                <div class="flex flex-col">
                  <label class="text-sm text-gray-500 dark:text-gray-400 mb-1">Dirección:</label>
                  <div class="rounded-lg bg-gray-50 dark:bg-surface-700 p-3 font-semibold text-gray-800 dark:text-gray-100">
                    {{ apo.direccion || 'Sin datos' }}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <template #footer>
      <Button label="Cerrar" text @click="cerrarDialogo" />
    </template>
  </Dialog>
</template>
