<script setup>
import { useDiagnosticoEstado } from '@/composables/useDiagnostico/useDiagnosticoEstado';
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  visible: Boolean,
  Diagnosticoid: Number,
  nombre: String,
  estado: String
});

const emit = defineEmits(['update:visible', 'save']);


const { cambiarEstado } = useDiagnosticoEstado();

const nuevoEstado = computed(() =>
  props.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
);



const verboAccion = computed(() =>
  props.estado === 'ACTIVO' ? 'desactivar' : 'restablecer'
);

const mensajeDescripcion = computed(() => {
  return verboAccion.value === 'desactivar'
    ? 'El diagnóstico será pausado temporalmente'
    :   'El diagnostico sera habilitado nuevamente';
});

const botonSeverity = computed(() =>
  props.estado === 'ACTIVO' ? 'danger' : 'primary'
);

async function confirmarCambioEstado() {
  const success = await cambiarEstado(props.Diagnosticoid);
  if (success) {
    emit('save');
    cerrarDialogo();
  }
}

function cerrarDialogo() {
  emit('update:visible', false);
}

</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    @update:visible="val => emit('update:visible', val)"
    modal
    :style="{ maxWidth: '30rem', width: '40vw'}"    
     :breakpoints="{
    '1199px': '80vw',
    '991px':  '80vw',
    '767px':  '80vw',
    '575px':  '80vw'
  }">
    <template #header >
      <div class="flex items-center justify-between w-full pr-2">
        <span class="font-semibold text-lg" style="font-size: 1.2rem;">Cambio de Estado</span>
      </div>
    </template>
      <div class="flex gap-3 p-4 pt-0">
        <i class="pi pi-info-circle text-1xl text-primary-600 mt-1" style="font-size: 1.5rem;"/>
        <div>
          <p style="font-size: 1.1rem;">
            <strong>¿Deseas {{ verboAccion }} el diagnostico  {{ props.nombre }}  del sistema?</strong>
          </p>
          <small class="text-color-secondary" style="font-size: 0.9rem;">
            {{ mensajeDescripcion }}
          </small>
        </div>
      </div>
    <template #footer>
      <Button label="Cerrar" outlined @click="cerrarDialogo" />
      <Button
        :label="verboAccion.charAt(0).toUpperCase() + verboAccion.slice(1)" :severity="botonSeverity" @click="confirmarCambioEstado" />
    </template>
  </Dialog>
</template>
