<script setup>
import { cambiarEstadoUsuario } from '@/service/UsuarioService';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  visible: Boolean,
  idUsuario: Number,
  nombre: String,
  estado: String
});

const emit = defineEmits(['update:visible', 'save']);

const nuevoEstado = computed(() =>
  props.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
);


const toast = useToast();

async function cambiarEstado (id) {
  return cambiarEstadoUsuario(id);
}


const verboAccion = computed(() =>
  props.estado === 'ACTIVO' ? 'desactivar' : 'restablecer'
);

const mensajeDescripcion = computed(() => {
  return verboAccion.value === 'desactivar'
    ? 'La cuenta será pausada temporalmente'
    : 'La cuenta será restablecida con acceso completo';
});

const botonSeverity = computed(() =>
  props.estado === 'ACTIVO' ? 'danger' : 'primary'
);

function cerrarDialogo() {
  emit('update:visible', false);
}

async function confirmarCambioEstado() {
  try {
    await cambiarEstado(props.idUsuario);
    toast.add({
      severity: 'success',
      summary: `Estado actualizado`,
      detail: `El usuario ha sido ${nuevoEstado.value.toLowerCase()}`,
      life: 3000
    });
    emit('save'); // para recargar tabla
    cerrarDialogo();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo cambiar el estado',
      life: 4000
    });
  }
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
            ¿Deseas <strong>{{ verboAccion }}</strong> la cuenta de
            <strong>{{ props.nombre }}</strong>?
          </p>
          <small class="text-color-secondary" style="font-size: 0.9rem;">
            {{ mensajeDescripcion }}
          </small>
        </div>
      </div>
    <template #footer>
      <Button label="Cerrar" outlined @click="cerrarDialogo" />
      <Button
        :label="verboAccion.charAt(0).toUpperCase() + verboAccion.slice(1)" :severity="botonSeverity"  @click="confirmarCambioEstado" />
    </template>
  </Dialog>
</template>
