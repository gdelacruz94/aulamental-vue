import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Inicio
        {
            path: '/',
            redirect: '/login'
        },
        //login
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        //rutas protegidas
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/usuario',
                    name: 'usuario',
                    component: () => import('@/views/pages/user/gestionUsuario.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/asistencia',
                    name: 'asistencia',
                    component: () => import('@/views/pages/user/gestionAsitencia.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/suceso',
                    name: 'suceso',
                    component: () => import('@/views/pages/sucesos/gestionSucesos.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/diagnostico',
                    name: 'diagnostico',
                    component: () => import('@/views/pages/diagnostico/gestionDiagnostico.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/atenAlumno',
                    name: 'atenAlumno',
                    component: () => import('@/views/pages/atencionAlumnos/gestionAtenAlumnos.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/atenApoderado',
                    name: 'atenApoderado',
                    component: () => import('@/views/pages/atencionApoderado/gestionAtenApoderado.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/tareas',
                    name: 'tareas',
                    component: () => import('@/views/pages/asignar/gestionTareas.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/tareasPracticante',
                    name: 'tareasPracticante',
                    component: () => import('@/views/pages/asignar/gestionTareasPracticante.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/alumnos',
                    name: 'alumnos',
                    component: () => import('@/views/pages/alumnos/gestionAlumnos.vue'),
                    meta: { requiresAuth: true }
                },

                {
                    path: '/cita',
                    name: 'cita',
                    component: () => import('@/views/pages/citas/agendarCita.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/citaPsicologo',
                    name: 'citaPsicologo',
                    component: () => import('@/views/pages/citas/gestionCita.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        // Rutas de pantalla de accesos denegados
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/auth/NotFound.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'ErrorServidor',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        // Rutas de paginas no dirigidas
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        return next('/auth/access');
    }

    next();
});

export default router;
