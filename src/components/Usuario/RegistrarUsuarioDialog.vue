<script setup>
import { useRoles } from '@/composables/useRoles';
import { usePersona } from '@/composables/useUsuario/usePersona';
import { useUsuarios } from '@/composables/useUsuario/useUsuarios';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';

/* ───── props/emit ───── */
const props = defineProps({ visible: Boolean });
const emit = defineEmits(['update:visible', 'save']);
const { persona, buscarPersona } = usePersona();

function cerrarDialogo() {
    resetFormulario();
    emit('update:visible', false);
}

/* ───── steps ───── */
const activeStep = ref(0);

const steps = [{ label: 'Datos Personales' }, { label: 'Credenciales' }, { label: 'Horarios' }];

const pasoActual = computed(() => `Paso ${activeStep.value + 1} de ${steps.length}: ${steps[activeStep.value].label}`);

/* ───── navegación ───── */

function esCorreoValido(correo) {
    return correo && correo.includes('@');
}

function siguientePaso() {
    if (activeStep.value === 0) {
        /* ── campos obligatorios ── */
        if (
            !tipoSeleccionado.value ||
            !ndocumento.value ||
            !nombre.value ||
            !apaterno.value ||
            !amaterno.value ||
            !lnacimiento.value ||
            !fechaNacimiento.value ||
            !telefono1.value ||
            !correopersonal.value ||
            !direccion.value ||
            !esCorreoValido(correopersonal.value)
        ) {
            toast.add({
                severity: 'warn',
                summary: 'Campos obligatorios',
                detail: 'Complete todos los campos correctamente. Asegúrese de que el correo personal tenga "@".',
                life: 3000
            });
            return;
        }

        /* ── longitud coherente con el tipo de documento ── */
        const longitudValida = (tipoSeleccionado.value === 'DNI' && ndocumento.value.length === 8) || (tipoSeleccionado.value === 'PASAPORTE' && ndocumento.value.length === 12);

        if (!longitudValida) {
            toast.add({
                severity: 'warn',
                summary: 'Documento inválido',
                detail: 'Verifica que el número de documento coincida con el tipo seleccionado.',
                life: 3000
            });
            return;
        }
    } else if (activeStep.value === 1) {
        if (!correoInstitucional.value || !contrasenia.value || roles.value.length === 0 || !esCorreoValido(correoInstitucional.value)) {
            toast.add({
                severity: 'warn',
                summary: 'Credenciales incompletas',
                detail: 'Verifique que los correos tengan "@", y que todos los campos estén llenos.',
                life: 3000
            });
            return;
        }
    }

    /* ── avanzar al siguiente paso ── */
    activeStep.value++;
}

function pasoAnterior() {
    if (activeStep.value > 0) activeStep.value--;
}

/* ───── Datos personales ───── */
const tiposDocumento = [
    { label: 'DNI', value: 'DNI' },
    { label: 'PASAPORTE', value: 'PASAPORTE' }
];

const tipoSeleccionado = ref(null);
const fechaNacimiento = ref(null);
const nombre = ref('');
const apaterno = ref('');
const amaterno = ref('');
const ndocumento = ref('');
const telefono1 = ref('');
const telefono2 = ref('');
const correopersonal = ref('');
const direccion = ref('');
const lnacimiento = ref('');

/* ───── Credenciales ───── */
const correoInstitucional = ref('');
const contrasenia = ref('');

/* ───── Roles ───── */
const { rolesDisponibles } = useRoles();
const roles = ref([]);

/* ───── Horarios ───── */
const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const selectedDias = ref([]);

const horas = Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: i
}));

const minutos = [0, 15, 30, 45].map((m) => ({
    label: String(m).padStart(2, '0'),
    value: m
}));

const horarios = reactive(Object.fromEntries(dias.map((d) => [d, { hora: null, min: null }])));

/* ─── controles de documento ─── */
const ndocumentoMaxlength = computed(() => {
    if (tipoSeleccionado.value === 'DNI') return 8;
    if (tipoSeleccionado.value === 'PASAPORTE') return 12;
    return null;
});

// bloqueado hasta elegir tipo
const ndocumentoDisabled = computed(() => !tipoSeleccionado.value);

// solo activo con DNI
const searchDisabled = computed(() => tipoSeleccionado.value !== 'DNI');

// limpia Nº doc al cambiar tipo
watch(tipoSeleccionado, () => {
    ndocumento.value = '';
});

// evita que supere el límite
watch(ndocumento, (val) => {
    const max = ndocumentoMaxlength.value;
    if (max && val.length > max) ndocumento.value = val.slice(0, max);
});

const camposNombreDeshabilitados = computed(() => tipoSeleccionado.value === 'DNI');

/* ────  resetFormulario ─────*/

function resetFormulario() {
    activeStep.value = 0;

    tipoSeleccionado.value = null;
    fechaNacimiento.value = null;
    nombre.value = '';
    apaterno.value = '';
    amaterno.value = '';
    ndocumento.value = '';
    telefono1.value = '';
    telefono2.value = '';
    correopersonal.value = '';
    direccion.value = '';
    lnacimiento.value = '';

    correoInstitucional.value = '';
    contrasenia.value = '';
    roles.value = [];

    selectedDias.value = [];
    dias.forEach((d) => {
        horarios[d].hora = null;
        horarios[d].min = null;
    });
}

watch(
    () => props.visible,
    (val) => {
        if (val) {
            resetFormulario();
        }
    }
);

/* ───── Envío API ───── */
const toast = useToast();
const idcreador = localStorage.getItem('id');
const { registrarUsuario } = useUsuarios(idcreador);

async function guardarUsuario() {
    try {
        const diasInvalidos = selectedDias.value.filter((dia) => horarios[dia].hora === null || horarios[dia].min === null);

        if (diasInvalidos.length > 0) {
            toast.add({
                severity: 'warn',
                summary: 'Horarios incompletos',
                detail: `Completa la hora y minutos para: ${diasInvalidos.join(', ')}`,
                life: 5000
            });
            return;
        }

        const payload = {
            idcreador,
            nombre: nombre.value,
            apaterno: apaterno.value,
            amaterno: amaterno.value,
            tdocumento: tipoSeleccionado.value,
            ndocumento: ndocumento.value,
            telefono1: telefono1.value,
            telefono2: telefono2.value,
            correopersonal: correopersonal.value,
            direccion: direccion.value,
            lnacimiento: lnacimiento.value,
            fnacimiento: fechaNacimiento.value?.toISOString().split('T')[0],
            correo: correoInstitucional.value,
            contrasenia: contrasenia.value,
            idRoles: rolesDisponibles.value.filter((r) => roles.value.includes(r.nombre)).map((r) => r.id),
            horarios: selectedDias.value.map((dia) => {
                const h = horarios[dia];
                return {
                    dias: dia.toUpperCase(),
                    hora: `${String(h.hora).padStart(2, '0')}:${String(h.min).padStart(2, '0')}`
                };
            })
        };

        await registrarUsuario(payload);
        toast.add({ severity: 'success', summary: 'Registro exitoso', detail: 'El usuario fue registrado correctamente en el sistema.', life: 4000 });
        emit('update:visible', false);
        emit('save');
    } catch (error) {
        const mensaje = error?.response?.data?.message || 'Error inesperado al registrar usuario';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
            life: 5000
        });
    }
}

async function onBuscarDni() {
    if (ndocumento.value.length !== 8) {
        toast.add({
            severity: 'warn',
            summary: 'DNI inválido',
            detail: 'Debe tener 8 dígitos.',
            life: 3000
        });
        return;
    }

    try {
        const data = await buscarPersona(ndocumento.value);
        nombre.value = data.nombres ?? '';
        apaterno.value = data.apellidoPaterno ?? '';
        amaterno.value = data.apellidoMaterno ?? '';
        tipoSeleccionado.value = 'DNI';
    } catch {
        /* manejado en composable */
    }
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
            <div class="flex flex-col">
                <span class="titulo-registrar">Registrar Nuevo Usuario</span>
                <span class="titulo-registrar-cantida-usuario">{{ pasoActual }}</span>
            </div>
        </template>

        <!-- steps -->
        <Steps :model="steps" :activeStep="activeStep" class="mb-4" />
        <div class="p-4">
            <div class="contenedor-modal" v-if="activeStep === 0" style="margin-bottom: 17rem">
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
                    <div class="flex align-items-center justify-content-center">
                        <div class="card-border-icon info2">
                            <i class="bi bi-person-vcard" style="font-size: 1.4rem" />
                        </div>
                        <span class="card-border-icon-text">Identificacion</span>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                        <!-- Tipo de Documento -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="tipoDoc">Tipo de Documento</label>
                            <Select v-model="tipoSeleccionado" :options="tiposDocumento" optionLabel="label" optionValue="value" placeholder="Seleccione un documento" class="w-full" />
                        </div>
                        <!-- Número de Documento -->
                        <div class="flex flex-col w-full md:w-1/2">
                            <label class="mb-2" for="numeroDoc">Número de Documento</label>
                            <div>
                                <InputText placeholder="Ej: 12345678" style="width: 84%; margin-right: 0.5rem" v-model="ndocumento" :disabled="ndocumentoDisabled" :maxlength="ndocumentoMaxlength" />
                                <Button icon="bi bi-search" :disabled="searchDisabled" class="white-space-nowrap" @click="onBuscarDni" />
                            </div>
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
                                    <InputText id="nombre" v-model="nombre" :disabled="camposNombreDeshabilitados" placeholder="Ej: Maria Alejandra" type="text" class="w-full" />
                                </div>
                                <!-- apellido paterno -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="apaterno">Apellido Paterno</label>
                                    <InputText id="apaterno" v-model="apaterno" type="text" :disabled="camposNombreDeshabilitados" placeholder="Ej: Gonzales" class="w-full" />
                                </div>
                                <!-- apellido materno -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="amaterno">Apellido Materno</label>
                                    <InputText id="amaterno" v-model="amaterno" type="text" :disabled="camposNombreDeshabilitados" placeholder="Ej: Quispe" class="w-full" />
                                </div>
                            </div>
                            <div class="flex flex-col md:flex-row gap-4" style="margin-top: 1.5rem">
                                <!-- Lugar de Nacimiento -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="lnacimiento">Lugar de Nacimiento</label>
                                    <InputText id="lnacimiento" v-model="lnacimiento" type="text" placeholder="Ej: Cusco" class="w-full" />
                                </div>
                                <!-- Fecha Nacimiento -->
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="fechaNac">Fecha de Nacimiento</label>
                                    <DatePicker id="fechaNac" v-model="fechaNacimiento" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" class="w-full" />
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
                                    <InputText id="telefono2" v-model="telefono2" type="text" :maxlength="9" placeholder="Ej: 987654321" class="w-full" />
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
                    <div class="flex mt-8">
                        <div style="width: 50vw">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="username">Correo Institucional </label>
                                    <InputText id="username" v-model="correoInstitucional" placeholder="Ej: usuario@abs.edu.pe" type="text" class="w-full" />
                                </div>
                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="password">Contraseña</label>
                                    <Password id="password" v-model="contrasenia" placeholder="Contraseña segura" :toggleMask="true" class="w-full" fluid :feedback="false" />
                                </div>
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
                                <div
                                    v-for="rol in rolesDisponibles"
                                    :key="rol.id"
                                    :class="[
                                        'flex items-center p-3 border rounded-lg w-max gap-2 diseño-roles transition-colors cursor-pointer',
                                        roles.includes(rol.nombre) ? 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600' : 'bg-white dark:bg-[#26262a] border-gray-200 dark:border-gray-700'
                                    ]"
                                >
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
            <Button v-else label="Guardar" @click="guardarUsuario" icon="pi pi-check" />
        </template>
    </Dialog>
</template>
