<script setup>
import { useRoles } from '@/composables/useRoles';
import { useUsuario } from '@/composables/useUsuario/useUsuarioDetails';
import { useUsuarioUpdate } from '@/composables/useUsuario/useUsuarioUpdate';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import { useToast } from 'primevue/usetoast';
import { defineEmits, defineProps, reactive, ref, watch } from 'vue';

/* ───── props/emit ───── */
const props = defineProps({ visible: Boolean, idUsuario: Number, nombreCompleto: String });
const emit = defineEmits(['update:visible', 'save']);
const toast = useToast();

function cerrarDialogo() {
    emit('update:visible', false);
}

/* ───── steps ───── */
const activeStep = ref(0);

const steps = [{ label: 'Datos Personales' }, { label: 'Credenciales' }, { label: 'Horarios' }];

const { usuario, cargarUsuario } = useUsuario();

/* ───── navegación ───── */

function esCorreoValido(correo) {
    return correo && correo.includes('@');
}

function siguientePaso() {
    if (activeStep.value === 0) {
        if (!telefono1.value || !correopersonal.value || !direccion.value || !esCorreoValido(correopersonal.value)) {
            toast.add({
                severity: 'warn',
                summary: 'Campos obligatorios',
                detail: 'Verifique que los correos tengan "@", y que todos los campos estén llenos.',
                life: 3000
            });
            return;
        }
    } else if (activeStep.value === 1) {
        if (roles.value.length === 0) {
            toast.add({
                severity: 'warn',
                summary: 'Credenciales incompletas',
                detail: 'Verifique que los correos tengan "@", y que todos los campos estén llenos.',
                life: 3000
            });
            return;
        }
    }

    activeStep.value++;
}

function pasoAnterior() {
    if (activeStep.value > 0) activeStep.value--;
}

const fechaNacimiento = ref(null);
const estado = ref('');
const nombre = ref('');
const apaterno = ref('');
const amaterno = ref('');
const ndocumento = ref('');
const telefono1 = ref('');
const telefono2 = ref('');
const correopersonal = ref('');
const direccion = ref('');
const lnacimiento = ref('');
const tdocumento = ref('');

/* ───── Credenciales ───── */
const correoInstitucional = ref('');

/* ───── Roles ───── */
const { rolesDisponibles } = useRoles();
const roles = ref([]);

/* ───── Horarios ───── */
const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const selectedDias = ref([]);

function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

const horas = Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: i
}));

const minutos = [0, 15, 30, 45].map((m) => ({
    label: String(m).padStart(2, '0'),
    value: m
}));

const horarios = reactive(Object.fromEntries(dias.map((d) => [d, { hora: null, min: null }])));

watch(
    () => props.visible,
    async (vis) => {
        if (vis && props.idUsuario) {
            await cargarUsuario(props.idUsuario);
            const u = usuario.value;
            if (!u) return;

            tdocumento.value = u.tdocumento;
            ndocumento.value = u.ndocumento;
            nombre.value = u.nombre;
            apaterno.value = u.apaterno;
            amaterno.value = u.amaterno;
            lnacimiento.value = u.lnacimiento;
            fechaNacimiento.value = u.fechanacimiento ? new Date(u.fechanacimiento) : null;
            telefono1.value = u.telefono1;
            telefono2.value = u.telefono2;
            correopersonal.value = u.correopersonal;
            direccion.value = u.direccion;
            correoInstitucional.value = u.correoinstitucional;
            estado.value = u.estado;

            roles.value = u.rolDtos.map((r) => r.nombre);

            selectedDias.value = u.horarios.map((h) => capitalizar(h.dias));
            u.horarios.forEach((h) => {
                const diaKey = capitalizar(h.dias);
                if (horarios[diaKey]) {
                    const [hh, mm] = h.hora.split(':');
                    horarios[diaKey].hora = Number(hh);
                    horarios[diaKey].min = Number(mm);
                }
            });

            activeStep.value = 0;
        }
    },

    { immediate: false }
);

const { guardar, saving } = useUsuarioUpdate();

function guardarUsuario() {
    const rolesId = rolesDisponibles.value.filter((rol) => roles.value.includes(rol.nombre)).map((rol) => rol.id);

    const horariosBody = selectedDias.value.map((dia) => {
        const horaObj = horarios[dia];
        const hora = String(horaObj.hora).padStart(2, '0');
        const min = String(horaObj.min).padStart(2, '0');
        return {
            dias: dia.toUpperCase(),
            hora: `${hora}:${min}`
        };
    });

    const payload = {
        id: props.idUsuario,
        telefono1: telefono1.value,
        telefono2: telefono2.value,
        correopersonal: correopersonal.value,
        direccion: direccion.value,
        rolesId,
        horarios: horariosBody
    };

    guardar(payload)
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Usuario actualizado',
                detail: 'Los cambios se guardaron correctamente',
                life: 3000
            });
            emit('save');
            cerrarDialogo();
        })
        .catch((err) => {
            toast.add({
                severity: 'error',
                summary: 'Error al guardar',
                detail: err.response?.data?.message || 'Error desconocido',
                life: 4000
            });
        });
}

function manejarSeleccionRol(rolSeleccionado) {
    if (roles.value.includes(rolSeleccionado)) {
        // Si lo estás marcando:
        if (rolSeleccionado === 'Psicologia') {
            // Psicología puede coexistir con Bienestar
            roles.value = roles.value.filter((r) => ['Psicologia', 'Bienestar'].includes(r));
        } else if (rolSeleccionado === 'Bienestar') {
            // Bienestar puede combinarse con Psicología, o estar sola
            roles.value = roles.value.filter((r) => ['Psicologia', 'Bienestar'].includes(r));
        } else {
            // Otros roles permiten solo uno
            roles.value = [rolSeleccionado];
        }
    }
}
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
        <!-- encabezado -->
        <template #header>
            <div class="diseño-header-modal">
                <div class="flex align-items-center justify-content-center" style="display: flex; align-items: center">
                    <div class="card-border-icon-visualizacion diseño-icon-modal-editar">
                        <i class="bi bi-pencil-square" style="font-size: 1.4rem" />
                    </div>
                    <div class="flex flex-col gap-1" style="margin-left: 1rem">
                        <span class="font-semibold text-xl text-gray-900 dark:text-surface-0">Editar Usuario</span>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600 dark:text-surface-0">Modificar información del usuario:</span>
                            <span class="pill-id">{{ props.nombreCompleto }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- steps -->
        <Steps :model="steps" :activeStep="activeStep" class="mb-4" />
        <div class="p-4">
            <div class="contenedor-modal" v-if="activeStep === 0">
                <!-- Informacion-->
                <div class="card-border-info dp">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="pi pi-user" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Datos Personales</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Complete la información personal del usuario</p>
                        </div>
                    </div>
                </div>
                <!-- Identificacion-->
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
                                    <InputText id="nombre" :disabled="true" v-model="nombre" type="text" class="w-full" />
                                </div>
                                <!-- apellido paterno -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="apaterno">Apellido Paterno</label>
                                    <InputText id="apaterno" :disabled="true" v-model="apaterno" type="text" class="w-full" />
                                </div>
                                <!-- apellido materno -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="amaterno">Apellido Materno</label>
                                    <InputText id="amaterno" :disabled="true" v-model="amaterno" type="text" class="w-full" />
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
                                    <DatePicker id="fechaNac" v-model="fechaNacimiento" :disabled="true" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" class="w-full" />
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
                                    <InputText id="telefono" v-model="telefono1" :maxlength="9" placeholder="Ej: 987654321" type="text" class="w-full" />
                                </div>
                                <!-- telefono 2 -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="telefono2">Telefono Secundario</label>
                                    <InputText id="telefono2" v-model="telefono2" :maxlength="9" type="text" placeholder="Ej: 987654321" class="w-full" />
                                </div>
                            </div>
                            <!-- Correo  Personal-->
                            <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="correopersonal">Correo Personal </label>
                                    <IconField style="width: 100%">
                                        <InputIcon class="bi bi-envelope" />
                                        <InputText v-model="correopersonal" id="correopersonal" placeholder="usuario@example.com" type="text" class="w-full" />
                                    </IconField>
                                </div>
                            </div>
                            <!-- Direccion-->
                            <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="telefono">Direccion </label>
                                    <Textarea placeholder="Av Los Próceres 123, Lima" v-model="direccion" :autoResize="true" rows="3" cols="30" style="width: 100%" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="activeStep === 1">
                <!-- Informacion-->
                <div class="card-border-info crede">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="pi pi-user" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Acceso y Permisos</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Configure las credencias y permisos del usuario</p>
                        </div>
                    </div>
                </div>
                <!-- Credenciales -->
                <div class="card-border">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-icon info">
                            <i class="bi bi-shield-lock" style="font-size: 1.4rem" />
                        </div>
                        <span class="card-border-icon-text">Credenciales de Usuario</span>
                    </div>
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
                        <span class="card-border-icon-text">Asignacion de Roles</span>
                    </div>
                    <div class="text-gray-800 dark:text-gray-300" style="margin-top: 0.8rem">
                        <label for="firstname2">Seleccione el rol que desea asignarle</label>
                    </div>
                    <div class="flex mt-5">
                        <div style="width: 50vw">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div v-for="rol in rolesDisponibles" :key="rol.id" class="flex items-center p-3 border border-gray-200 rounded-lg w-max gap-2 diseño-roles">
                                    <Checkbox
                                        v-model="roles"
                                        :inputId="rol.nombre"
                                        :value="rol.nombre"
                                        @change="manejarSeleccionRol(rol.nombre)"
                                        :disabled="
                                            (rol.nombre === 'Bienestar' && !roles.includes('Psicologia') && roles.some((r) => !['Psicologia', 'Bienestar'].includes(r))) ||
                                            (rol.nombre === 'Psicologia' && roles.some((r) => !['Psicologia', 'Bienestar'].includes(r))) ||
                                            (!['Psicologia', 'Bienestar'].includes(rol.nombre) && roles.some((r) => r !== rol.nombre) && !roles.includes(rol.nombre))
                                        "
                                    />
                                    <label :for="rol.nombre" class="text-gray-800 dark:text-white">
                                        {{ rol.nombre }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="card-border-info horario">
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-info-icon info">
                            <i class="pi pi-user" style="font-size: 1.4rem" />
                        </div>
                        <div style="margin-left: 1rem">
                            <h3 class="m-0 text-lg font-semibold" style="color: #fff; font-size: 1.5rem">Horarios</h3>
                            <p class="m-0 text-sm opacity-90" style="color: #fff">Configure los horarios de trabajo</p>
                        </div>
                    </div>
                </div>
                <div class="card-border">
                    <p class="text-center text-sm text-gray-800 dark:text-gray-300 mb-6" style="font-size: 1rem">Selecciona los días y horarios de disponibilidad</p>
                    <div class="flex justify-center">
                        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
                            <div v-for="dia in dias" :key="dia" class="dia-checkbox dark:text-gray-8001" :class="{ selected: selectedDias.includes(dia) }">
                                <!-- Hora seleccionada -->
                                <div class="personalizacion-horario flex items-center gap-3 w-full md:w-auto">
                                    <Checkbox :inputId="`chk_${dia}`" v-model="selectedDias" :value="dia" />
                                    <i class="bi bi-calendar"></i> <label :for="`chk_${dia}`" class="font-medium w-28">{{ dia }}</label> <i class="bi bi-clock"></i
                                    ><Dropdown v-model="horarios[dia].hora" :options="horas" optionLabel="label" optionValue="value" :disabled="!selectedDias.includes(dia)" placeholder="Hora" class="w-full md:w-[10rem]" />
                                    <span>:</span>
                                    <!-- Minuto seleccionada -->
                                    <Dropdown v-model="horarios[dia].min" :options="minutos" optionLabel="label" optionValue="value" :disabled="!selectedDias.includes(dia)" placeholder="Min" class="w-full md:w-[6rem]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- footer -->
        <template #footer>
            <Button label="Cancelar" text @click="cerrarDialogo" />
            <Button label="Anterior" text @click="pasoAnterior" :disabled="activeStep === 0" />
            <Button v-if="activeStep < steps.length - 1" label="Siguiente" text @click="siguientePaso" />
            <Button v-else label="Guardar" icon="pi pi-check" :loading="saving" :disabled="saving" @click="guardarUsuario" />
        </template>
    </Dialog>
</template>
