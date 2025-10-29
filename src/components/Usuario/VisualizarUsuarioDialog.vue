<script setup>
import { useUsuario } from '@/composables/useUsuario/useUsuarioDetails';
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
    visible: Boolean,
    idUsuario: Number
});
const emit = defineEmits(['update:visible']);

const { usuario, loading, cargarUsuario } = useUsuario();

watch(
    () => props.visible,
    (val) => {
        if (val && props.idUsuario) {
            cargarUsuario(props.idUsuario);
        }
    }
);

function cerrarDialogo() {
    emit('update:visible', false);
}

const tdocumento = computed(() => usuario.value?.tdocumento ?? '');
const ndocumento = computed(() => usuario.value?.ndocumento ?? '');
const nombre = computed(() => usuario.value?.nombre ?? '');
const apaterno = computed(() => usuario.value?.apaterno ?? '');
const amaterno = computed(() => usuario.value?.amaterno ?? '');
const lnacimiento = computed(() => usuario.value?.lnacimiento ?? '');
const fechaNacimiento = computed(() => usuario.value?.fechanacimiento ?? '');
const telefono1 = computed(() => usuario.value?.telefono1 ?? '');
const telefono2 = computed(() => usuario.value?.telefono2 ?? '');
const correopersonal = computed(() => usuario.value?.correopersonal ?? '');
const correoInstitucional = computed(() => usuario.value?.correoinstitucional ?? '');
const direccion = computed(() => usuario.value?.direccion ?? '');
const iniciales = computed(() => usuario.value?.iniciales ?? '??');
const estado = computed(() => usuario.value?.estado ?? '??');
const nombreCompleto = computed(() => `${nombre.value} ${apaterno.value} ${amaterno.value}`);
const roles = computed(() => usuario.value?.rolDtos ?? []);
const horarios = computed(() => usuario.value?.horarios ?? []);

const activeIndex = ref(2);
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        @update:visible="(val) => emit('update:visible', val)"
        modal
        class="modal-personalizado"
        :style="{ maxWidth: '80rem', width: '90vw' }"
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
                    <Avatar :label="iniciales" class="mr-0" size="large" />
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-xl text-gray-900 dark:text-surface-0">{{ nombreCompleto }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600 dark:text-surface-0">Usuario del Sistema</span>
                            <span class="pill-id">ID: {{ idUsuario }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <Tabs value="0" style="border-radius: 5rem">
            <TabList>
                <Tab value="0"> Datos Personales </Tab>
                <Tab value="1"> Credenciales </Tab>
                <Tab value="2"> Horarios </Tab>
            </TabList>
            <TabPanels class="tab-diseño-visual">
                <TabPanel value="0">
                    <!-- Documentacion -->
                    <div class="card-border">
                        <!-- Encabezado -->
                        <div class="flex items-center gap-2 mb-3">
                            <div class="card-border-icon info">
                                <i class="pi pi-user text-xl"></i>
                            </div>
                            <span class="card-border-icon-text font-semibold">Identificación</span>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                            <!-- Tipo de Documento -->
                            <div class="flex flex-col w-full md:w-1/2">
                                <label class="mb-2" for="tipoDoc">Tipo de Documento</label>
                                <InputText id="tipoDoc" class="w-full" :disabled="true" v-model="tdocumento" />
                            </div>

                            <!-- Número de Documento -->
                            <div class="flex flex-col w-full md:w-1/2">
                                <label class="mb-2" for="numeroDoc">Número de Documento</label>
                                <InputText id="numeroDoc" class="w-full" :disabled="true" v-model="ndocumento" />
                            </div>
                        </div>
                    </div>
                    <!-- Informacion Personal -->
                    <div class="card-border">
                        <div class="flex align-items-center justify-content-center">
                            <div class="card-border-icon info2">
                                <i class="pi pi-users" style="font-size: 1.4rem" />
                            </div>
                            <span class="card-border-icon-text">Información Personal</span>
                        </div>
                        <div class="flex mt-8">
                            <div style="width: 70vw">
                                <div class="flex flex-col md:flex-row gap-4">
                                    <!-- nombre -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="nombre">Nombres</label>
                                        <InputText id="nombre" v-model="nombre" :disabled="true" type="text" class="w-full" />
                                    </div>
                                    <!-- apellido paterno -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="apaterno">Apellido Paterno</label>
                                        <InputText id="apaterno" v-model="apaterno" type="text" :disabled="true" class="w-full" />
                                    </div>
                                    <!-- apellido materno -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="amaterno">Apellido Materno</label>
                                        <InputText id="amaterno" v-model="amaterno" type="text" :disabled="true" class="w-full" />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                    <!-- Lugar de Nacimiento -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="lnacimiento">Lugar de Nacimiento</label>
                                        <InputText id="lnacimiento" v-model="lnacimiento" type="text" :disabled="true" class="w-full" />
                                    </div>
                                    <!-- Fecha Nacimiento -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="fechaNac">Fecha de Nacimiento</label>
                                        <DatePicker id="fechaNac" :disabled="true" v-model="fechaNacimiento" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" class="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--ifnormacion de contacto -->
                    <div class="card-border">
                        <div class="flex align-items-center justify-content-center">
                            <div class="card-border-icon info3">
                                <i class="bi bi-telephone" style="font-size: 1.4rem" />
                            </div>
                            <span class="card-border-icon-text">Información de Contacto</span>
                        </div>
                        <div class="flex mt-8">
                            <div style="width: 70vw">
                                <div class="flex flex-col md:flex-row gap-4">
                                    <!-- telefono -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="telefono">Telefono Principal</label>
                                        <InputText id="telefono" v-model="telefono1" :disabled="true" type="text" class="w-full" />
                                    </div>
                                    <!-- telefono 2 -->
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="telefono2">Telefono Secundario</label>
                                        <InputText id="telefono2" v-model="telefono2" type="text" :disabled="true" class="w-full" />
                                    </div>
                                </div>
                                <!-- Correo  Personal-->
                                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="correopersonal">Correo Personal </label>
                                        <IconField style="width: 100%">
                                            <InputIcon class="bi bi-envelope" />
                                            <InputText v-model="correopersonal" id="correopersonal" :disabled="true" type="text" class="w-full" />
                                        </IconField>
                                    </div>
                                </div>
                                <!-- Direccion-->
                                <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="telefono">Direccion </label>
                                        <Textarea :disabled="true" v-model="direccion" :autoResize="true" rows="3" cols="30" style="width: 100%" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <!-- Credenciales del Usuario-->
                    <div class="card-border">
                        <!-- Encabezado -->
                        <div class="flex align-items-center justify-content-center">
                            <div class="card-border-icon info">
                                <i class="bi bi-shield-lock" style="font-size: 1.4rem" />
                            </div>
                            <span class="card-border-icon-text">Credenciales de Usuario</span>
                        </div>
                        <!-- Contenido -->
                        <div class="flex flex-col md:flex-row items-start md:items-end gap-1 mt-4 w-full">
                            <!-- Input -->
                            <div class="flex flex-col w-full md:w-9/12">
                                <label for="usernamev" class="mb-2">Correo Institucional</label>
                                <InputText id="usernamev" v-model="correoInstitucional" :disabled="true" type="text" class="w-full" />
                            </div>
                            <!-- Botón decorativo -->
                            <div class="w-full md:w-2/12 flex justify-start" style="margin-top: 2vw; width: 20rem; height: 2.5rem">
                                <div :class="['chip', estado === 'ACTIVO' ? 'chip--ACTIVO' : 'chip--INACTIVO']">
                                    <span class="chip__dot"></span>
                                    <span>{{ estado === 'ACTIVO' ? 'Cuenta Activa' : 'Cuenta Inactiva' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Roles -->
                    <div class="card-border">
                        <div class="flex align-items-center justify-content-center">
                            <div class="card-border-icon info4">
                                <i class="pi pi-users" style="font-size: 1.4rem" />
                            </div>
                            <span class="card-border-icon-text">Roles Asignados</span>
                        </div>
                        <div class="text-gray-800 dark:text-gray-300" style="margin-top: 0.8rem">
                            <label for="firstname2"></label>
                        </div>
                        <div class="flex mt-5">
                            <div style="width: 50vw">
                                <div v-for="rol in roles" :key="rol.id" :class="['rol-chip', `rol-${rol.nombre.toLowerCase()}`]" style="margin-left: 0.5rem">
                                    <span class="dot"></span>
                                    <span>{{ rol.nombre }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div class="card-border">
                        <!-- Encabezado -->
                        <div class="flex align-items-center justify-content-center">
                            <div class="card-border-icon info3">
                                <i class="bi bi-clock" style="font-size: 1.4rem" />
                            </div>
                            <span class="card-border-icon-text">Horarios de Trabajo</span>
                        </div>
                        <div class="flex flex-wrap gap-3" style="margin-top: 1.5rem">
                            <div v-for="dia in horarios" :key="dia.dias" :class="['dia-card', `color-${dia.dias}`]">
                                <div class="dia-header">
                                    <span class="dia-punto"></span>
                                    <strong>{{ dia.dias }}</strong>
                                    <span class="dia-etiqueta">{{ dia.diminituvo }}</span>
                                </div>
                                <div class="dia-hora">
                                    <i class="pi pi-clock"></i>
                                    <span>{{ dia.hora }}</span>
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
