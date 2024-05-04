'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import * as React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAppContext } from '../context/AppContextProvider';

const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));
const RootPage = React.lazy(() => import('../pages/RootPage'));
const MeetingPage = React.lazy(() => import('../pages/MeetingPage'));

const AppRouter = () => {
  const { state } = useAppContext();

  return useRoutes([
    { path: '/', element: <RootPage /> },
    { path: '*', element: <NotFoundPage /> },
    {
      path: '/meeting/:meetingId',
      element: state.roomKey ? <MeetingPage /> : <Navigate to="/" />,
    },
  ]);
};

export default AppRouter;
