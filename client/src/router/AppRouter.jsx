'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import * as React from 'react';
import { useRoutes } from 'react-router-dom';

const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));
const RootPage = React.lazy(() => import('../pages/RootPage'));
const MeetingPage = React.lazy(() => import('../pages/MeetingPage'));

export const AppRouter = () =>
  // define all routes here (https://reactrouter.com/en/main/hooks/use-routes)
  useRoutes([
    { path: '/', element: <RootPage /> },
    { path: '*', element: <NotFoundPage /> },
    { path: '/meeting', element: <MeetingPage /> },
  ]);
