import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Space, Spin } from 'antd';
import Root from '../layout/Root';
import Login from '../pages/Login/Login';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ErrorBoundary from '../pages/ErrorBoundary/ErrorBoundary';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Authenticated from './Authenticated';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import NotFound from '../components/NotFound/NotFound';

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const EmployeeList = lazy(() => import('../pages/EmployeeList/EmployeeList'));
const EmployeeCommon = lazy(() => import('../pages/EmployeeCommon/EmployeeCommon'));
const ProjectList = lazy(() => import('../pages/ProjectList/ProjectList'));
const ProjectCommon = lazy(() => import('../pages/ProjectCommon/ProjectCommon'));
const TaskList = lazy(() => import('../pages/TaskList/TaskList'));
const TaskCommon = lazy(() => import('../pages/TaskCommon/TaskCommon'));
const ReportList = lazy(() => import('../pages/ReportList/ReportList'));
const CreateReport = lazy(() => import('../pages/CreateReport/CreateReport'));
const VerifiedEmail = lazy(() => import('../pages/VerifiedEmail/VerifiedEmail'));
const ChangePassword = lazy(() => import('../pages/ChangePassword/ChangePassword'));

const fallback = (
  <Space
    direction="vertical"
    style={{
      width: '100%',
      height: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spin tip="Loading" size="large">
      <span style={{ opacity: '0' }}>content</span>
    </Spin>
  </Space>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Authenticated />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'verify-email',
        element: (
          <Suspense fallback={fallback}>
            <VerifiedEmail />
          </Suspense>
        ),
      },

      {
        element: <PrivateRoute />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            element: <AdminRoute />,
            errorElement: <ErrorBoundary />,
            children: [
              {
                path: 'employee/',
                children: [
                  {
                    path: 'list',
                    element: (
                      <Suspense fallback={fallback}>
                        <EmployeeList />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'add',
                    element: (
                      <Suspense fallback={fallback}>
                        <EmployeeCommon />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <Suspense fallback={fallback}>
                        <EmployeeCommon />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'detail/:id',
                    element: (
                      <Suspense fallback={fallback}>
                        <EmployeeCommon />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: 'project/',
                children: [
                  {
                    path: 'list',
                    element: (
                      <Suspense fallback={fallback}>
                        <ProjectList />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'add',
                    element: (
                      <Suspense fallback={fallback}>
                        <ProjectCommon />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'edit/:id',
                    element: (
                      <Suspense fallback={fallback}>
                        <ProjectCommon />
                      </Suspense>
                    ),
                    errorElement: <ErrorBoundary />,
                  },
                ],
              },
            ],
          },
          {
            path: '404',
            element: <NotFound />,
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={fallback}>
                <EmployeeCommon />
              </Suspense>
            ),
          },
          {
            path: '',
            element: (
              <Suspense fallback={fallback}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'change-password',
            element: (
              <Suspense fallback={fallback}>
                <ChangePassword />
              </Suspense>
            ),
          },
          {
            path: 'task/',
            children: [
              {
                path: 'list',
                element: (
                  <Suspense fallback={fallback}>
                    <TaskList />
                  </Suspense>
                ),
              },
              {
                path: 'add',
                element: (
                  <Suspense fallback={fallback}>
                    <TaskCommon />
                  </Suspense>
                ),
              },
              {
                path: 'edit/:id',
                element: (
                  <Suspense fallback={fallback}>
                    <TaskCommon />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'report/',
            children: [
              {
                path: 'list',
                element: (
                  <Suspense fallback={fallback}>
                    <ReportList />
                  </Suspense>
                ),
              },
              {
                path: 'add',
                element: (
                  <Suspense fallback={fallback}>
                    <CreateReport />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ErrorBoundary />,
      },
    ],
  },
]);

export default router;
