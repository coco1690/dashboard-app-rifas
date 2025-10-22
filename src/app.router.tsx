import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { SinglePageLayout } from "./single_page/layouts/SinglePageLayout";
import { InicioPage } from "./single_page/pages/inicio/InicioPage";
import { RifasPage } from "./single_page/pages/rifas/RifasPage";
import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";
import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { CrearRifasPage } from "./admin/pages/crear_rifas/CrearRifasPage";
import { AdminRifasPage } from "./admin/pages/rifas/AdminRifasPage";
import { DescargaBoletasPage } from "./single_page/pages/descarga_boletas/DescargaBoletasPage";
import { AdminOrdenesPage } from "./admin/pages/ordenes/AdminOrdenes";
import { AdminAgenciasPage } from "./admin/pages/agencias/AdminAgenciasPage";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import AgencyLayout from "./agency/layouts/AgencyLayout";
import { DashboardAgencyPage } from "./agency/pages/dashboard/DashboardAgencyPage";
import { AgencyClientsPage } from "./agency/pages/clients/AgencyClientsPage";

import { AdminViewAgencyIdPage } from "./admin/pages/agencias/pages/AdminViewAgencyIdPage";
import { AdminRifasIdPage } from "./admin/pages/rifas/page/AdminRifasIdPage";
import { RecargarBoletosForm } from "./admin/pages/recargas/recargarBoletosForm";
import { AgencyVentasPage } from "./agency/pages/ventas/AgencyVentasPage";
import {  AgencyHistorialPage } from "./agency/pages/historial/AgencyHistorialPage";
import { AgencyOrders } from "./agency/pages/ordenes/AgencyOrders";
import { AgencyRifasActivas } from "./agency/pages/rifas_activas/AgencyRifasActivas";
import { AdminHistorialVentas } from "./admin/pages/historial/AdminHistorialVentas";
import NewClientePage from "./agency/pages/clients/NewClientePage";
import CrearAgenciasPage from "./admin/pages/crear_agencias/CrearAgenciasPage";
import { DialogTerminosyCondiciones } from "./single_page/components/DialogTerminosyCondiciones";



const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))

export const appRouter = createBrowserRouter([
    //public routes
    {
        path: '/',
        element: <SinglePageLayout />,
        children: [
            {
                index: true,
                element: <InicioPage />
            },
            {
                path: 'rifas',
                element: <RifasPage />
            },
            {
                path: 'rifas/:id',
                element: <RifasPage />
            },
            {
                path: 'descargas',
                element: <DescargaBoletasPage />
            },
            {
                path: 'terminos_y_condiciones',
                element: <DialogTerminosyCondiciones />
            },


        ]
    },

    //Auth Routes
    {
        path: '/auth',
        element: (
            <ProtectedRoute requireAuth={false}>
                <AuthLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/auth/login" />
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
        ]
    },

    //Admin Routes
    {
        path: '/admin',
        element: (
            <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: 'admin_rifas/new',
                element: <CrearRifasPage />
            },
            {
                path: 'admin_rifas',
                element: <AdminRifasPage />
            },
            {
                path: 'admin_rifas/:id',
                element: <AdminRifasIdPage />
            },
            {
                path: 'admin_agencias/new_agencia',
                element: <CrearAgenciasPage />
            },
            {
                path: 'admin_agencias',
                element: <AdminAgenciasPage />
            },
            {
                path: 'admin_agencias/:id',
                element: <AdminViewAgencyIdPage />
            },
            {
                path: 'recargas',
                element: <RecargarBoletosForm />
            },
            {
                path: 'ordenes',
                element: <AdminOrdenesPage />
            },
            {
                path: 'admin_historial',
                element: <AdminHistorialVentas />
            },

        ]
    },

    //Admin Routes
    {
        path: '/agency',
        element: (
            <ProtectedRoute requireAuth={true} allowedRoles={['agencia']}>
                <AgencyLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardAgencyPage />
            },
             {
                path: 'clients',
                element: <AgencyClientsPage />
            },
             {
                path: 'clients/new_client',
                element: <NewClientePage />
            },
             {
                path: 'rifas_activas',
                element: <AgencyRifasActivas />
            },
            {
                path: 'ventas',
                element: <AgencyVentasPage />
            },
            {
                path: 'historial',
                element: <AgencyHistorialPage />
            },
            {
                path: 'ordenes',
                element: <AgencyOrders />
            },

        ]
    },

    {
        path: '*',
        element: <Navigate to="/" />
    },

])
